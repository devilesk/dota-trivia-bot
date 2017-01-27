function Queue(context, delay) {
    this.queue = [];
    this.context = context;
    this.delay = delay;
    this.interval = null;
}

Queue.prototype.start = function () {
    if (this.interval) this.stop();
    this.interval = setInterval(this.handler.bind(this), this.delay);
    return this;
}

Queue.prototype.stop = function () {
    clearInterval(this.interval);
    return this;
}

Queue.prototype.push = function (item) {
    this.queue.push(item);
    return this;
}

Queue.prototype.size = function () {
    return this.queue.length;
}

Queue.prototype.handler = function () {
    if (this.queue.length > 0) {
        var isValid = this.queue.shift().execute(this.context);
        while (!isValid && this.queue.length > 0) {
            isValid = this.queue.shift().execute(this.context);
        }
    }
}

module.exports = Queue;