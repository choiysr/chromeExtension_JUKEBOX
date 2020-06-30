class URL {

    constructor(commonURL) {
        this.commonURL = commonURL;
    }

    get(value) {
        return this.commonURL + value;
    }

}


class Chart {

    constructor() {
        this.realtimeObj = '';
        this.dailyObj = '';
        this.weeklyObj = '';
        this.monthlyObj = '';
    }

    setTypeObj(type,content) {
        if(type == 'realtime') {
            this.realtimeObj = content;
        }else if(type == 'daily') {
            this.dailyObj = content;
        }else if(type == 'weekly') {
            this.weeklyObj = content;
        }else {
            this.monthlyObj = content;
        }
    }

    getTypeObj(type) {
        let result = '';
        if(type == 'realtime') {
            result = this.realtimeObj;
        }else if(type == 'daily') {
            result = this.dailyObj;
        }else if(type == 'weekly') {
            result = this.weeklyObj;
        }else {
            result = this.monthlyObj;
        }
        return result;
    }

}
