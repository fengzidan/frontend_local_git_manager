const SHELL_STATUS = {
  "-1": {
    label: "失败",
    color: "#ff6b6b",
  },
  "0": {
    label: "待操作",
    color: "#333",
  },
  "1": {
    label: "成功",
    color: "#7ae582",
  },
  "2": {
    label: "进行中...",
    color: "#918ef4",
  },
};

export { SHELL_STATUS };

export default class ShellObj {
  shell = "";
  out = "";
  status: Number = 0;
  constructor() {
    this.status = 0;
  }
  get ifRuning() {
    return this.status === 2;
  }

  get ifEnd() {
    return this.status === -1 || this.status === 1;
  }

  fail({ cmd = "", out = "" }) {
    this.status = -1;
    this.shell = cmd;
    this.out = out;
  }

  success({ cmd = "", out = "" }) {
    this.status = 1;
    this.shell = cmd
    this.out = out;
  }

  run() {
    this.status = 2;
  }
}
