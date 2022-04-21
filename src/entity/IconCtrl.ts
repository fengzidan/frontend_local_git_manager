import { genId } from "../utils/tool";

/**
 * @class icon类控制项
 * @param id 唯一标志，随机生成
 * @param name 文字描述
 * @param icon 控制项的icon
 * @param onClick 点击事件
 * @description icon类控制项，默认不显示名称
 * @author zhangzedan
 * @date 2022-03-01
 */
export default class IconCtrl {
  id = "";
  name = "控制项";
  icon = "setup";
  onClick?: () => void;

  // 显示控制
  showName = false;
  showIcon = true;
  // 子级菜单项
  children: IconCtrl[] = [];
  showChild = false;

  constructor({
    name = "控制项",
    icon = "setup",
    showName = false,
    onClick = null,
    children = [],
  }) {
    this.id = genId(5, "ctrl");
    this.name = name;
    this.icon = icon;
    this.showName = showName;
    this.onClick =
      onClick ||
      function (this: IconCtrl) {
        console.log(`当前点击了'${this.name}', 无事件`);
      };
    if (children) {
      this.setChild(children);
    }
  }

  /**
   * @function 触发点击事件
   * @author zhangzedan
   * @date 2022-03-02
   */
  click() {
    this.onClick && this.onClick();
  }

  /**
   * @function 配置子菜单项
   * @param children 类型为IconCtrl的数组
   * @description 配置子菜单项
   * @author zhangzedan
   * @date 2022-03-02
   */
  setChild(children: any[] = []) {
    if (children.length > 0) {
      this.showChild = true;
      this.children = children.map((item: IconCtrl | Object) => {
        const ctrlItem = item instanceof IconCtrl ? item : new IconCtrl(item);
        ctrlItem.showIcon = false;
        ctrlItem.showName = true;
        return ctrlItem;
      });
    } else {
      this.showChild = false;
    }
  }
}
