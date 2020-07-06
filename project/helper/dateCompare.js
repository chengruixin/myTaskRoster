function compareTimeInStr(str1, str2){
    const date1 = new Date(str1);
    const date2 = new Date(str2);

    console.log("Comparing ", date1.getTime(), " and " , date2.getTime());
    if(date1.getTime() > date2.getTime()) return 1;
    else if(date1.getTime() === date2.getTime()) return 0;
    else return -1;
}


function compareTimeInDate(date1, date2){
    console.log("Comparing ", date1.getTime(), " and " , date2.getTime());
    if(date1.getTime() > date2.getTime()) return 1;
    else if(date1.getTime() === date2.getTime()) return 0;
    else return -1;
}

module.exports = {compareTimeInDate, compareTimeInStr };
