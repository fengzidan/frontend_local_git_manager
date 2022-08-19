declare interface IPath {
  path: string;
  name: string;
  data: Array<any>;
  isSvn: boolean;
  isGit: boolean;

  hidden: boolean;
  isDir: boolean;
  isVue: boolean;
  isNode: boolean;
}
