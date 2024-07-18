const { cpu, time, cpuTemperature, currentLoad, memLayout, diskLayout, mem, osInfo, processes } = require("systeminformation");
const pidusage = require("pidusage");

module.exports = {
    name: "بيانات",
    type: 'النظام',
    creator: 'لنك',
    info: 'يعرض بيانات',
    version: "2.2.0",
    usageCount: 0,
    run: async (api, event) => {
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
            const processInfo = await processes();

            const { manufacturer, brand, speedMax, physicalCores, cores } = cpuData;
            const { main: mainTemp } = temperature;
            const { currentLoad: currentLoadPercentage } = load;
            const { uptime } = systemTime;
            const { total: totalMem, available: availableMem } = memory;
            const { platform: OSPlatform, build: OSBuild } = os;
            const topProcesses = processInfo.list.slice(0, 5);

            let hours = Math.floor(uptime / (60 * 60));
            let minutes = Math.floor((uptime % (60 * 60)) / 60);
            let seconds = Math.floor(uptime % 60);
            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;

            let disk = [], i = 1;
            for (const singleDisk of diskInfo) {
                disk.push(
                    `    「 القرص ${i++} 」    \n` +
                    "الاسم: " + singleDisk.name + "\n" +
                    "النوع: " + singleDisk.interfaceType + "\n" +
                    "الحجم: " + byte2mb(singleDisk.size) + "\n" +
                    "السرعة: " + (singleDisk.smartStatus || "غير متاح") + "\n" +
                    "درجة الحرارة: " + (singleDisk.temperature || "غير متاح") + "°C"
                );
            }

            let processesOutput = "──── 「 العمليات الجارية 」 ────\n";
            for (const proc of topProcesses) {
                processesOutput += `🔧 الاسم: ${proc.name} | 🖥️ استخدام المعالج: ${proc.cpu.toFixed(1)}% | 💾 استخدام الذاكرة: ${byte2mb(proc.mem)}\n`;
            }

            const systemMessage = 
                "────── معلومات النظام ──────\n" +
                "──── 「 وحدة المعالجة المركزية 」 ────\n" +
                `⚙️ موديل المعالج: ${manufacturer} ${brand} ${speedMax}GHz\n` +
                `🧵 النواة: ${cores}\n` +
                `🧩 عدد الخيوط: ${physicalCores}\n` +
                `🌡️ درجة الحرارة: ${mainTemp}°C\n` +
                `⚡ التحميل الحالي: ${currentLoadPercentage.toFixed(1)}%\n` +
                `🖥️ استخدام المعالج بواسطة Node: ${pidUsage.cpu.toFixed(1)}%\n` +
                "──── 「 الذاكرة 」 ────\n" +
                `💾 الحجم: ${byte2mb(memInfo[0].size)}\n` +
                `🔧 النوع: ${memInfo[0].type}\n` +
                `📈 إجمالي الذاكرة: ${byte2mb(totalMem)}\n` +
                `📉 الذاكرة المتاحة: ${byte2mb(availableMem)}\n` +
                `💽 استخدام الذاكرة بواسطة Node: ${byte2mb(pidUsage.memory)}\n` +
                disk.join("\n") + "\n" +
                "──── 「 نظام التشغيل 」 ────\n" +
                `🖥️ المنصة: ${OSPlatform}\n` +
                `🏷️ البناء: ${OSBuild}\n` +
                `⏱️ مدة التشغيل: ${hours}:${minutes}:${seconds}\n` +
                `📡 الوقت المستغرق: ${Date.now() - timeStart}ms\n` +
                processesOutput;

            return api.sendMessage(systemMessage, event.threadID, event.messageID);
        } catch (e) {
            console.log(e);
            return api.sendMessage("⚠️ حدث خطأ أثناء استرجاع معلومات النظام.", event.threadID, event.messageID);
        }
    }
};