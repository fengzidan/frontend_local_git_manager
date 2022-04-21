<template>
  <div class="nodata_box">
    <div class="nodata">
      <div class="left_content"><i class="el-icon-info nodata_icon"></i></div>
      <div class="right_content">
        <div class="top_letter">您的请求已经提交,系统返回如下信息:</div>
        <div class="bottom_letter">您没有权限访问当前的页面 或 链接失效,请重新登录</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.nodata_box{
  display: flex;
}
.nodata {
  display: flex;
  height: 100px;
  /* width: 40%; */
  border: 2px solid #409eff;
  margin: 0 auto;
  margin-top: 40px;
}
.left_content{
  margin: auto 30px;
}
.nodata_icon {
  font-size: 60px;
  color: #409eff;
}
.right_content{
  margin: auto 20px;
}
.top_letter{
  line-height: 20px;
  font-size: 16px;
  color: #909399;
}
.bottom_letter{
  line-height: 30px;
  font-size: 18px;
  color: black;
  font-weight: bold;
}
</style>
