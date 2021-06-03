<template>
	<div class="editor-style" :style="{'minHeight':height+'px'}">
		<input type="file" @change="change" :id="props" style="display:none;" />
		<quill-editor v-model="content" style="height: 100%" ref="myQuillEditor" @blur="toKeepData()" :options="editorOption">
		</quill-editor>
	</div>
</template>

<script>
import toolbarOptions from './editorConfig'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'  //添加
import Base64 from './../../module/index/Base64'
Quill.register('modules/imageResize', ImageResize)
export default {
	name: 'editorComponent',
	components: {
		quillEditor
	},
	props: ['prop', 'height', 'parentContent'],
	data() {
		let picLink = value => {
			console.log(this.props)
			if (value) {
				document.querySelector('#' + this.props).click()
			} else {
				this.quill.format('image', false);
			}
		}
		return {
			imgBase64Array: [],
			content: '',
			props: '',
			editorOption: {
				scrollingContainer: '#editorcontainer',
				placeholder: '',
				// or 'bubble'
				theme: 'snow',
				modules: {
					imageResize: {
						displayStyles: {
							backgroundColor: 'black',
							border: 'none',
							color: 'white'
						},
						modules: ['Resize', 'DisplaySize', 'Toolbar']
					},
					toolbar: {
						// 工具栏
						container: toolbarOptions,
						handlers: {
							'image': picLink
						}
					}
				}
			},
		}
	},
	created() {
		this.props = this.prop
	},
	mounted() {
		this.content = this.myDecode(this.parentContent||'')
	},
	methods: {
		myDecode(str) {
			var auth64 = str.trim();
			if (auth64 == "") {
				return;
			}
			return new Base64().decode(auth64);
		},
		toKeepData() {
			this.$emit('getContent', this.prop, this.content)
		},
		change(e) {
			let file = e.target.files[0];
			const self = this
			let reader = new FileReader()
			reader.readAsDataURL(file)
			let quill = this.$refs.myQuillEditor.quill
			reader.onload = function (event) {
				self.dealImage(this.result, 500, img_base64 => {
					self.imgBase64Array.push(img_base64)
					self.imgBase64Array.push(img_base64)
					let length = quill.getSelection().index;//光标位置
					quill.insertEmbed(length, 'image', img_base64)
				})
			}
		},
		dealImage(base64, w, callback) {
			var newImage = new Image();
			var quality = 0.6;    //压缩系数0-1之间
			newImage.src = base64;
			newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
			var imgWidth, imgHeight;
			newImage.onload = function () {
				imgWidth = this.width;
				imgHeight = this.height;
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				if (Math.max(imgWidth, imgHeight) > w) {
					if (imgWidth > imgHeight) {
						canvas.width = w;
						canvas.height = w * imgHeight / imgWidth;
					} else {
						canvas.height = w;
						canvas.width = w * imgWidth / imgHeight;
					}
				} else {
					canvas.width = imgWidth;
					canvas.height = imgHeight;
					quality = 0.6;
				}
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
				// 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
				// while (base64.length / 1024 > 150) {
				// 	quality -= 0.01;
				// 	base64 = canvas.toDataURL("image/jpeg", quality);
				// }
				// 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
				// while (base64.length / 1024 < 50) {
				// 	quality += 0.001;
				// 	base64 = canvas.toDataURL("image/jpeg", quality);
				// }
				callback(base64);//必须通过回调函数返回，否则无法及时拿到该值
			}
		},
	},
}
</script>

<style scoped type="text/less" lang="less">
.editor-style {
	@hei: 800;
	max-height: @hei*1px;
	min-height: 170px;
	overflow: hidden;
	/deep/.ql-container {
		overflow: auto;
		max-height: (@hei - 30) * 1px;
		min-height: 170px;
	}
}
</style>
