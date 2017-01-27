var Command = function (fn, args, callback, condition, context) {
    this.fn = fn;
    this.args = args;
    this.callback = callback;
    this.condition = condition || function () { return true; };
    this.context = context;
    this.execute = function (context) {
        var isValid = this.condition();
        console.log('command execute valid', isValid);
        if (isValid) this.fn.apply(this.context || context, this.args);
        if (this.callback) this.callback.call(this.context || context, isValid);
        return isValid;
    }
}

module.exports = Command;