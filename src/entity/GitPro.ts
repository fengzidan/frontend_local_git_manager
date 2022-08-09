import GitShell from "./GitShell";
import RemotePro, { IRemotePro } from "./RemotePro";
export default class GitPro extends RemotePro {
  // shell命令-Git
  gitShell?: GitShell = new GitShell();

  constructor(data: IRemotePro) {
    super(data);
    this.gitShell = new GitShell();
  }
}
