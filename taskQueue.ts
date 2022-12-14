const taskQueue = {
  queue: [] as (() => Promise<any>)[], // 执行队列
  count: 3, // 并发数
  workingCount: 0,
  pushTask: function (tasks: (() => Promise<any>)[], count?: number) {
    if (count) {
      this.count = count;
    }
    this.queue = this.queue.concat(tasks);
    // this.start();
  },
  /**
   * 开始执行
   * @param type first: 第一次取this.count个，其后每次只放一个入栈
   */
  start: function (type = 'first') {
    for(let i = 0; i < (type === 'first' ? this.count : 1); i++) {
      if(this.queue.length === 0) {
        break;
      }
      if(this.workingCount === this.count) {
        break;
      }
      const item = this.queue.shift();
      this.workingCount ++;
      item && item().then(res => {
        this.workingCount --;
        this.start('second');
      });
    }
  },
  empty: function () {
    this.queue = [];
    this.count = 3;
    this.workingCount = 0;
  }
};

export default taskQueue;
