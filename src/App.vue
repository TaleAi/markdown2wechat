<template>
  <div id="app" class="container">
    <el-container>
      <el-menu mode="horizontal">
        <el-menu-item index="1">{{ title }}</el-menu-item>
        <el-menu-item index="2"
          ><a
            href="https://github.com/TaleAi/markdown2wechat/issues/new"
            target="_blank"
            >提需求</a
          >
        </el-menu-item>
        <el-menu-item index="3" @click="aboutDialogVisible = true"
          >关于</el-menu-item
        >
      </el-menu>
      <el-header height="auto" class="top" style="width:100%">
        <el-row>
          <el-col :sm="24" :md="5">
            编辑器主题：<el-select
              v-model="currentEditorTheme"
              size="mini"
              placeholder="请选择编辑器主题"
              @change="editorThemeChanged"
            >
              <el-option
                v-for="editorTheme in editorThemes"
                :key="editorTheme.value"
                :label="editorTheme.label"
                :value="editorTheme.value"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :sm="24" :md="6">
            链接转换方式：<el-select
              v-model="useReferences"
              size="mini"
              placeholder="选择链接转换方式"
              @change="useReferencesChanged"
            >
              <el-option label="显示链接" :value="0"></el-option>
              <el-option label="去掉链接" :value="1"></el-option>
              <el-option label="使用引用显示链接" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :sm="24" :md="4">
            字体：<el-select
              v-model="currentFont"
              size="mini"
              placeholder="选择字体"
              @change="fontChanged"
            >
              <el-option
                v-for="font in builtinFonts"
                :style="{ fontFamily: font.value }"
                :key="font.value"
                :label="font.label"
                :value="font.value"
              >
                <span style="float: left">{{ font.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px"
                  >Abc</span
                >
              </el-option>
            </el-select>
          </el-col>
          <el-col :sm="24" :md="5">
            字体大小：<el-select
              v-model="currentSize"
              size="mini"
              placeholder="选择段落字体大小"
              @change="sizeChanged"
            >
              <el-option
                v-for="size in sizeOption"
                :key="size.value"
                :label="size.label"
                :value="size.value"
              >
                <span style="float: left">{{ size.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  size.desc
                }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :sm="24" :md="4">
            主题：<el-select
              v-model="currentTheme"
              size="mini"
              placeholder="选择主题样式"
              @change="themeChanged"
            >
              <el-option
                v-for="theme in themeOption"
                :key="theme.value"
                :label="theme.label"
                :value="theme.value"
              >
                <span style="float: left">{{ theme.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  theme.author
                }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="24" v-if="isMobile">
            <el-button type="primary" @click="showPreview = !showPreview">{{
              showPreview ? "返回编辑" : "显示预览"
            }}</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="main-body">
        <el-row :gutter="10" class="main-section">
          <el-col :sm="24" :md="12" v-show="!showPreview">
            <textarea
              id="editor"
              type="textarea"
              placeholder="在此处输入您的markdown."
              v-model="source"
            >
            </textarea>
          </el-col>
          <el-col
            :sm="24"
            :md="12"
            class="preview-wrapper"
            v-show="(isMobile && showPreview) || !isMobile"
          >
            <section>
              <div class="hint">
                全选复制或<a href="#" @click="copy" class="copy-button"
                  >点此复制</a
                >，然后在公众号编辑器粘贴
              </div>
              <div class="phone-box">
                <div class="top">
                  <div class="r"></div>
                  <div class="l"></div>
                  <div class="ri"></div>
                </div>
                <div class="center">
                  <div class="preview" contenteditable="true">
                    <div id="output" v-html="output"></div>
                  </div>
                </div>
                <div class="bottom">
                  <div class="tome"></div>
                </div>
              </div>
            </section>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-dialog
      title="关于"
      :visible.sync="aboutDialogVisible"
      width="30%"
      center
    >
      <div style="text-align: center;">
        <p>markdown转微信公众号格式化编辑器助你轻松搞定多微信公众号</p>
        <p>
          如果你喜欢我的工具，可以：关注我的博客我的<a
            href="https://aizhuanqian.online"
            target="_blank"
            class="url"
            >博客，点击跳转</a
          >
        </p>
        <div style="margin: 20px;">微信打赏我</div>
        <img
          src="./assets/images/wechat_qr.jpeg"
          style="width: 60%; display: block; margin: 0 auto;"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="aboutDialogVisible = false"
          >打赏了！</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultTheme from "@/lib/default";
import lupengTheme from "@/lib/lupeng";
import WxRenderer from "@/lib/wx-renderer";
import CodeMirror from "codemirror";
import marked from "marked";
import axios from "axios";

export default {
  name: "App",
  data: function() {
    return {
      title: "markdown转微信公众号编辑器",
      aboutOutput: "",
      output: "",
      source: "",
      showPreview: false,
      isMobile: false,
      editorThemes: [
        {
          label: "base16-light",
          value: "base16-light",
        },
        {
          label: "duotone-light",
          value: "duotone-light",
        },
        {
          label: "monokai",
          value: "monokai",
        },
        {
          label: "base16-dark",
          value: "base16-dark",
        },
        {
          label: "duotone-dark",
          value: "duotone-dark",
        },
        {
          label: "ambiance-mobile",
          value: "ambiance-mobile",
        },
      ],
      currentEditorTheme: "base16-light",
      editor: null,
      builtinFonts: [
        {
          label: "衬线",
          value:
            "Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
        },
        {
          label: "无衬线",
          value:
            "Roboto, Oxygen, Ubuntu, Cantarell, PingFangSC-light, PingFangTC-light, 'Open Sans', 'Helvetica Neue', sans-serif",
        },
      ],
      currentFont:
        "Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
      currentSize: "16px",
      useReferences: 0,
      sizeOption: [
        {
          label: "16px",
          value: "16px",
          desc: "默认",
        },
        {
          label: "17px",
          value: "17px",
          desc: "正常",
        },
        {
          label: "18px",
          value: "18px",
          desc: "稍大",
        },
      ],
      currentTheme: "default",
      themeOption: [
        {
          label: "默认",
          value: "default",
          author: "tale",
        },
        {
          label: "lupeng",
          value: "lupeng",
          author: "鲁鹏",
        },
      ],
      styleThemes: {
        default: defaultTheme,
        lupeng: lupengTheme,
      },
      aboutDialogVisible: false,
    };
  },
  created() {
    if (document.documentElement.clientWidth <= 640) {
      this.isMobile = true;
    }
  },
  mounted() {
    var self = this;
    this.editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
      lineNumbers: false,
      lineWrapping: true,
      styleActiveLine: true,
      theme: this.currentEditorTheme,
      mode: "text/x-markdown",
    });
    this.editor.on("change", function(cm, change) {
      self.refresh();
    });
    // this.currentFont = this.builtinFonts[0],
    this.wxRenderer = new WxRenderer({
      theme: this.styleThemes.default,
      fonts: this.currentFont,
      size: this.currentSize,
      useReferences: this.useReferences,
    });
    axios({
      method: "get",
      url: "/default-content.md",
    }).then(function(resp) {
      self.editor.setValue(resp.data);
    });
  },
  methods: {
    renderWeChat: function(source) {
      var output = marked(source, {
        renderer: this.wxRenderer.getRenderer(),
      });
      if (this.wxRenderer.hasFootnotes()) {
        output += this.wxRenderer.buildFootnotes();
      }
      return output;
    },
    editorThemeChanged: function(editorTheme) {
      this.editor.setOption("theme", editorTheme);
    },
    fontChanged: function(fonts) {
      this.wxRenderer.setOptions({
        fonts: fonts,
      });
      this.refresh();
    },
    useReferencesChanged: function(value) {
      this.wxRenderer.setOptions({
        useReferences: value,
      });
      this.refresh();
    },
    sizeChanged: function(size) {
      this.wxRenderer.setOptions({
        size: size,
      });
      this.refresh();
    },
    themeChanged: function(name) {
      let themeName = name;
      var themeObject = this.styleThemes[themeName];
      this.wxRenderer.setOptions({
        theme: themeObject,
      });
      this.refresh();
    },
    refresh: function() {
      this.output = this.renderWeChat(this.editor.getValue());
    },
    copy: function() {
      var clipboardDiv = document.getElementById("output");
      clipboardDiv.focus();
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.setStartBefore(clipboardDiv.firstChild);
      range.setEndAfter(clipboardDiv.lastChild);
      window.getSelection().addRange(range);

      try {
        if (document.execCommand("copy")) {
          this.$message({
            message: "已复制到剪贴板",
            type: "success",
          });
        } else {
          this.$message({
            message: "未能复制到剪贴板，请全选后右键复制",
            type: "warning",
          });
        }
      } catch (err) {
        this.$message({
          message: "未能复制到剪贴板，请全选后右键复制",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="less">
@import url("./assets/css/phone.css");
</style>
