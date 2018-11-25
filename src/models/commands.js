//commands.js
//defines classes and models for turing assembler configuration

class Command {
    constructor(name, cmd) {
        this.name = name;
        this.cmd = cmd;
    }
}

class Cmd_rwRt {
    constructor(q0, t0, q1, t1) {
        this.q0 = q0;
        this.t0 = t0;
        this.q1 = q1;
        this.q1 = t1;
    }
}

class Cmd_rwLt {
    constructor(q0, t0, q1, t1) {
        this.q0 = q0;
        this.t0 = t0;
        this.q1 = q1;
        this.q1 = t1;
    }
}

class Cmd_rR1 {
    constructor(q, t) {
        this.q = q;
        this.t = t;
    }
}

class Cmd_rL1 {
    constructor(q, t) {
        this.q = q;
        this.t = t;
    }
}

class Cmd_rRt {
    constructor(q0, t, q1) {
        this.q0 = q0;
        this.t = t;
        this.q1 = q1;
    }
}

class Cmd_rLt {
    constructor(q0, t, q1) {
        this.q0 = q0;
        this.t = t;
        this.q1 = q1;
    }
}

module.exports = {
    Command,
    Cmd_rwRt,
    Cmd_rwLt,
    Cmd_rR1,
    Cmd_rL1,
    Cmd_rRt,
    Cmd_rLt
};