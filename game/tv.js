// year, month (1-12), day (1-31), hour (0-23), minute, second
// weekDay (1-7, 1 for Sunday, ..., 7 for Saturday)

// --- 节目链接/信息 Map ---
// 键为节目内部名称，值为包含节目详细信息的对象。
const programLinkMap = {
    '天气预报': { name: '天气欲报', passtime: 2, passage: 'TV Weather Forecast', onclick: '', 
		suffix: '<<if Weather.bloodMoon and Weather.dayState is "night">><span class="wraith">W̷͑͊͌͘͠Ṙ̵̽͂͐͆͠Á̶̈́͆͝I̸͌͋͌͋͂͠T̶̓͂͌̐͋͠͝Ḧ̷́̀̏̓͛͠</span><</if>>'},
    '绝密食谱': { name: '撅密食谱', passtime: 30, passage: 'TV Recipe', onclick: '', 
		suffix: '<<if Time.days%7 eq 0>><span class="lblue">特别节目</span><</if>>' },
    '肥皂剧': { name: '多角关系放映厅', passtime: 30, passage: 'TV Soap Opera', onclick: '', suffix: '' },
    '动物世界': { name: '洞物世界', passtime: 60, passage: 'TV Animal World', onclick: '', suffix: '' },
};


// --- 节目单数据结构 ---

// 常驻节目单：始终在节目列表最开始追加的节目。
const persistentSchedule = ["天气预报"];

// 通常节目单 (原默认节目单)：按周几和小时存储节目。
// normalSchedule[周几][小时] 是一个节目名称数组。
// 周几: 1-7 (1 for Sunday, 2 for Monday, ..., 7 for Saturday)
// 小时: 0-23
// 注意：数组索引 0 将不使用，以使索引 1-7 直接对应周几 1-7。
// 每个小时的节目列表是一个数组，可以包含多个节目。
const normalSchedule = [
    null, // 索引 0 不使用

    // Sunday (1)
    [
        /*0-4*/ [], [], [], [], [],
        /*5-8*/ [], [], [], [],
        /*9-12*/ [], [], [], [],
        /*13-16*/ [], [], [], [],
        /*17-20*/ [], ['绝密食谱','肥皂剧'], ['肥皂剧', '动物世界'], ['肥皂剧'],
        /*21-23*/ ['肥皂剧'], ['肥皂剧'], []
    ],
    // Monday (2)
    [
        /*0-4*/ [], [], [], [], [],
        /*5-8*/ [], [], [], [],
        /*9-12*/ [], [], [], [],
        /*13-16*/ [], [], [], [],
        /*17-20*/ [], ['绝密食谱','肥皂剧'], ['肥皂剧'], ['肥皂剧'],
        /*21-23*/ ['肥皂剧'], ['肥皂剧'], []
    ],
    // Tuesday (3)
    [
        /*0-4*/ [], [], [], [], [],
        /*5-8*/ [], [], [], [],
        /*9-12*/ [], [], [], [],
        /*13-16*/ [], [], [], [],
        /*17-20*/ [], ['肥皂剧'], ['肥皂剧', '动物世界'], ['肥皂剧'],
        /*21-23*/ ['肥皂剧'], ['肥皂剧'], []
    ],
    // Wednesday (4)
    [
        /*0-4*/ [], [], [], [], [],
        /*5-8*/ [], [], [], [],
        /*9-12*/ [], [], [], [],
        /*13-16*/ [], [], [], [],
        /*17-20*/ [], ['绝密食谱','肥皂剧'], ['肥皂剧'], ['肥皂剧'],
        /*21-23*/ ['肥皂剧'], ['肥皂剧'], []
    ],
    // Thursday (5)
    [
        /*0-4*/ [], [], [], [], [],
        /*5-8*/ [], [], [], [],
        /*9-12*/ [], [], [], [],
        /*13-16*/ [], [], [], [],
        /*17-20*/ [], ['肥皂剧'], ['肥皂剧', '动物世界'], ['肥皂剧'],
        /*21-23*/ ['肥皂剧'], ['肥皂剧'], []
    ],
    // Friday (6)
    [
        /*0-4*/ [], [], [], [], [],
        /*5-8*/ [], [], [], [],
        /*9-12*/ [], [], [], [],
        /*13-16*/ [], [], [], [],
        /*17-20*/ [], ['绝密食谱','肥皂剧'], ['肥皂剧'], ['肥皂剧'],
        /*21-23*/ ['肥皂剧'], ['肥皂剧'], []
    ],
    // Saturday (7)
    [
        /*0-4*/ [], [], [], [], [],
        /*5-8*/ [], [], [], [],
        /*9-12*/ [], [], [], [],
        /*13-16*/ [], [], [], [],
        /*17-20*/ [], ['肥皂剧'], ['肥皂剧', '动物世界'], ['肥皂剧'],
        /*21-23*/ ['肥皂剧'], ['肥皂剧'], []
    ],
];

// 特殊节目单：在特定日期和时间出现的节目。
// 每个对象可以包含 year, month, day, hour, weekDay 属性，未指定的属性表示任意。
// month: 1-12, day: 1-31, hour: 0-23, weekDay: 1-7 (1 for Sunday, ..., 7 for Saturday)
// programs 属性是一个数组，可以包含多个节目。
const specialSchedule = [
    // { month: 4, day: 1, hour: 14, programs: ['愚人节特别节目', '整蛊时刻'] }, // 多个节目示例
    // { day: 1, hour: 8, programs: ['每月1号特别节目'] },
    // { year: 2023, month: 12, day: 25, hour: 19, programs: ['圣诞特别晚会', '节日祝福'] }, // 2023年12月25日19
    // { weekDay: 6, hour: 20, programs: ['周五晚间访谈', '嘉宾互动'] } // 每周五
];

// 唯一节目单：在特定日期和时间出现，唯一节目单出现时无其他节目
// weekDay: 1-7 (1 for Sunday, ..., 7 for Saturday)
// programs 属性是一个数组，可以包含多个节目。
const uniqueSchedule = [
    // { year: 2024, month: 7, day: 15, hour: 10, programs: ['独家新闻发布会', '记者问答环节'] }
];

// --- 辅助函数 ---

/**
 * 检查 DateTime 对象是否匹配节目单条目。
 * @param {DateTime} dateTime 当前时间对象。
 * @param {object} entry 节目单条目。
 * @returns {boolean} 是否匹配。
 */
function matchesScheduleEntry(dateTime, entry) {
    if (entry.year !== undefined && entry.year !== dateTime.year) return false;
    if (entry.month !== undefined && entry.month !== dateTime.month) return false;
    if (entry.day !== undefined && entry.day !== dateTime.day) return false;
    if (entry.hour !== undefined && entry.hour !== dateTime.hour) return false;
    // 比较 weekDay 时直接使用 1-7 的值
    if (entry.weekDay !== undefined && entry.weekDay !== dateTime.weekDay) return false;
    return true;
}

/**
 * 将节目名称转换为其对应的节目对象，并添加到结果数组中，同时处理去重。
 * @param {string[]} programNames 节目名称数组。
 * @param {Array<object>} resultPrograms 结果节目对象数组。
 * @param {Set<string>} seenProgramNames 已添加的节目名称 Set，用于去重。
 */
function addProgramObjects(programNames, resultPrograms, seenProgramNames) {
    for (const programName of programNames) {
        const programObject = programLinkMap[programName]; // 从 programLinkMap 获取节目对象
        if (programObject !== undefined && !seenProgramNames.has(programName)) {
            resultPrograms.push(programObject);
            seenProgramNames.add(programName);
        }
    }
}

/**
 * 内部辅助函数：根据当前时间返回可看的节目名称列表，不包含常驻节目，用于生成日节目单。
 * @param {DateTime} currentTime 当前时间对象。
 * @returns {string[]} 可看的节目名称数组。
 * @private
 */
function _getRawProgramsAtTime(currentTime) {
    const programs = [];
    const seenPrograms = new Set(); // 用于去重

    // 1. 检查唯一节目单
    for (const entry of uniqueSchedule) {
        if (matchesScheduleEntry(currentTime, entry)) {
            // 如果匹配唯一节目单，则只返回唯一节目单的节目
            for (const program of entry.programs) {
                if (!seenPrograms.has(program)) {
                    programs.push(program);
                    seenPrograms.add(program);
                }
            }
            return programs; // 找到唯一节目单匹配项，直接返回
        }
    }

    // 2. 检查特殊节目单 (如果唯一节目单没有匹配)
    for (const entry of specialSchedule) {
        if (matchesScheduleEntry(currentTime, entry)) {
            for (const program of entry.programs) {
                if (!seenPrograms.has(program)) {
                    programs.push(program);
                    seenPrograms.add(program);
                }
            }
        }
    }

    // 3. 检查通常节目单 (如果唯一节目单没有匹配)
    const weekDay = currentTime.weekDay; // 使用 1-7 的 weekDay
    const hour = currentTime.hour;

    // 确保 weekDay 在 1-7 的有效范围内
    if (weekDay >= 1 && weekDay <= 7 && normalSchedule[weekDay] && normalSchedule[weekDay][hour]) {
        for (const program of normalSchedule[weekDay][hour]) {
            if (!seenPrograms.has(program)) {
                programs.push(program);
                seenPrograms.add(program);
            }
        }
    }

    return programs; // 返回合并后的节目列表
}


// --- 主要函数 ---

/**
 * 根据当前时间返回可看的电视节目对象列表。
 * @param {DateTime} currentTime 当前时间对象。
 * @returns {Array<object>} 可看的节目对象数组，每个对象包含 name, passtime, passage等属性。
 */
function getProgramsAtTime(currentTime) {
    const programsObjects = []; // 存储最终的节目对象
    const seenProgramNames = new Set(); // 用于去重，存储已添加的节目名称

    // 1. 首先尝试处理唯一节目单
    for (const entry of uniqueSchedule) {
        if (matchesScheduleEntry(currentTime, entry)) {
            // 如果匹配唯一节目单，则只返回唯一节目单的节目
            // 在添加唯一节目之前，先添加常驻节目
            addProgramObjects(persistentSchedule, programsObjects, seenProgramNames);
            addProgramObjects(entry.programs, programsObjects, seenProgramNames);
            return programsObjects; // 找到唯一节目单匹配项，直接返回
        }
    }

    // 2. 如果唯一节目单没有匹配，则添加常驻节目
    addProgramObjects(persistentSchedule, programsObjects, seenProgramNames);

    // 3. 检查特殊节目单
    for (const entry of specialSchedule) {
        if (matchesScheduleEntry(currentTime, entry)) {
            addProgramObjects(entry.programs, programsObjects, seenProgramNames);
        }
    }

    // 4. 检查通常节目单
    const weekDay = currentTime.weekDay; // 使用 1-7 的 weekDay
    const hour = currentTime.hour;

    // 确保 weekDay 在 1-7 的有效范围内
    if (weekDay >= 1 && weekDay <= 7 && normalSchedule[weekDay] && normalSchedule[weekDay][hour]) {
        addProgramObjects(normalSchedule[weekDay][hour], programsObjects, seenProgramNames);
    }

    return programsObjects; // 返回合并后的节目对象列表
}


/**
 * 输出特定日期的节目单字符串。
 * 考虑不同节目单之间的关系，但忽略常驻节目单。
 * @param {DateTime} date 特定日期对象。
 * @returns {string} 当日的具体节目单字符串。
 */
function getDailyScheduleString(date) {
    let scheduleString = `${date.year}年${String(date.month).padStart(2, '0')}月${String(date.day).padStart(2, '0')}日 <br><br>`;
    const dailyRawPrograms = []; // 存储每个小时的原始节目名称数组

    // 填充每天24小时的节目
    for (let hour = 0; hour < 24; hour++) {
        // 创建一个临时的 DateTime 对象，用于获取该小时的节目
        const currentHourTime = new DateTime(date.year, date.month, date.day, hour, 0, 0);
        dailyRawPrograms[hour] = _getRawProgramsAtTime(currentHourTime);
    }

    let currentHour = 0;
    while (currentHour < 24) {
        const programsAtStartHour = dailyRawPrograms[currentHour];
        let endHour = currentHour;

        // 查找连续的相同节目时间段
        // 注意：这里使用 JSON.stringify(array.sort()) 来比较数组内容是否相同，
        // 因为数组的直接比较会比较引用，而不是内容。sort() 确保元素顺序一致。
        while (endHour + 1 < 24 &&
               JSON.stringify(dailyRawPrograms[endHour + 1].sort()) === JSON.stringify(programsAtStartHour.sort())) {
            endHour++;
        }

        const startHourFormatted = String(currentHour).padStart(2, '0');
        const nextHourFormatted = String(endHour).padStart(2, '0'); // 结束时间的下一小时

        let programContent;
        if (programsAtStartHour.length === 0) {
            programContent = '无节目';
        } else {
            // 从 programLinkMap 中获取每个节目的显示名称
            const displayNames = programsAtStartHour.map(programName => {
                const programObject = programLinkMap[programName];
                return programObject ? programObject.name : programName; // 如果找不到，则回退到原始名称
            });
            programContent = displayNames.join(', ');
        }

        // 按照新的格式添加 <br>
        scheduleString += `${startHourFormatted}:00-${nextHourFormatted}:59 ${programContent}<br>`;
        currentHour = endHour + 1;
    }

    return scheduleString;
}

window.getProgramsAtTime = getProgramsAtTime;
window.getDailyScheduleString = getDailyScheduleString;

// 2023年10月1日 (周日) 的节目单
// const date1 = new DateTime(2023, 10, 1, 8, 1, 0); // 2023年10月1日 周日 0:00
// console.log(getDailyScheduleString(date1));
// console.log(getProgramsAtTime(date1));
