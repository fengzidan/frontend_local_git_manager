// 加载modules
interface modules {
  [idx: string]: any;
}
const modules: modules = {};

const modulesGlob = import.meta.glob("./*/index.ts");
for (const path in modulesGlob) {
  const res = await modulesGlob[path]();
  const name = path.split("/")[1];
  modules[name] = res.default;
}
export default modules;
