const { cpu, time, cpuTemperature, currentLoad, memLayout, diskLayout, mem, osInfo } = require("systeminformation");
const pidusage = require("pidusage");
// قم بتحديث هذا الاستيراد حسب الحاجة

module.exports = {
    name: "نظام",
    type: '❍ المـطـور ❍',
    version: "1.0.1",
    hasPermssion: 0,
    execute: async (api, event) => {
        function byte2mb(bytes) {
            const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            let l = 0, n = parseInt(bytes, 10) || 0;
            while (n >= 1024 && ++l) n = n / 1024;
            return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
        }

        const timeStart = Date.now();

        try {
            const pidUsage = await pidusage(process.pid);
            const cpuData = await cpu();
            const temperature = await cpuTemperature();
            const load = await currentLoad();
            const systemTime = await time();
            const diskInfo = await diskLayout();
            const memInfo = await memLayout();
            const memory = await mem();
            const os = await osInfo();

            const { manufacturer, brand, speedMax, physicalCores, cores } = cpuData;
            const { main: mainTemp } = temperature;
            const { currentLoad: currentLoadPercentage } = load;
            const { uptime } = systemTime;
            const { total: totalMem, available: availableMem } = memory;
            const { platform: OSPlatform, build: OSBuild } = os;

            let hours = Math.floor(uptime / (60 * 60));
            let minutes = Math.floor((uptime % (60 * 60)) / 60);
            let seconds = Math.floor(uptime % 60);
            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;

            let disk = [], i = 1;
            for (const singleDisk of diskInfo) {
                disk.push(
                    `    「 DISK ${i++} 」    \n` +
                    "Name: " + singleDisk.name + "\n" +
                    "Type: " + singleDisk.interfaceType + "\n" +
                    "Size: " + byte2mb(singleDisk.size) + "\n" +
                    "Temperature: " + singleDisk.temperature + "°C"
                );
            }

            const systemMessage = 
                "────── System Info ──────\n" +
                "──── 「 CPU 」 ────\n" +
                `CPU Model: ${manufacturer} ${brand} ${speedMax}GHz\n` +
                `Cores: ${cores}\n` +
                `Threads: ${physicalCores}\n` +
                `Temperature: ${mainTemp}°C\n` +
                `Load: ${currentLoadPercentage.toFixed(1)}%\n` +
                `Node usage: ${pidUsage.cpu.toFixed(1)}%\n` +
                "──── 「 MEMORY 」 ────\n" +
                `Size: ${byte2mb(memInfo[0].size)}\n` +
                `Type: ${memInfo[0].type}\n` +
                `Total: ${byte2mb(totalMem)}\n` +
                `Available: ${byte2mb(availableMem)}\n` +
                `Node usage: ${byte2mb(pidUsage.memory)}\n` +
                disk.join("\n") + "\n" +
                "──── 「 OS 」 ────\n" +
                `Platform: ${OSPlatform}\n` +
                `Build: ${OSBuild}\n` +
                `Uptime: ${hours}:${minutes}:${seconds}\n` +
                `Ping: ${Date.now() - timeStart}ms`;

            return api.sendMessage(systemMessage, event.threadID, event.messageID);
        } catch (e) {
            console.log(e);
            return api.sendMessage("An error occurred while retrieving system information.", event.threadID, event.messageID);
        }
    }
}