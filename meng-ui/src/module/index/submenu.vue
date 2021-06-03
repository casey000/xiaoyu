<template>
	<!--只含一级菜单-->
	<el-menu-item v-if="!menuObj[item.id]"  @click="selected(item.name,item.id, item.url)">
			<i class="el-icon-menu"></i>
			<span class="menu-level">{{ item.name }}
			</span>
	</el-menu-item>

	<!--多层菜单-->
	<el-submenu :index="item.id+''" v-else>
		<!--第一层菜单-->
		<template slot="title">
			<i class="el-icon-menu"></i>
			<span class="menu-level">{{ item.name }}
			</span>
		</template>

		<template v-for="itemSub in menuObj[item.id]" >
            <submenu :item="itemSub" :menuObj="menuObj" @selected="selected"></submenu>
			<!--二级菜单(不含三级菜单)-->
<!--			<el-menu-item  v-if="!menuObj[itemSub.id]" :key="itemSub.id" @click="selected(itemSub.name,itemSub.id, itemSub.url)">-->
<!--					 <i class="el-icon-document"></i>-->
<!--					 <span>{{itemSub.name}}</span>-->
<!--			</el-menu-item>-->

<!--			&lt;!&ndash;二级菜单(含三级菜单)&ndash;&gt;-->
<!--			<el-submenu v-else :index="itemSub.name" :key="itemSub.id"   class="midMenu"> -->
<!--				<template slot="title">-->
<!--				  <i class="el-icon-menu"></i>-->
<!--					<span class="menu-level">{{ itemSub.name }}-->
<!--					</span>-->
<!--				</template>-->
<!--				&lt;!&ndash;三级菜单&ndash;&gt;-->
<!--				<el-menu-item  v-for="element in menuObj[itemSub.id]" :key="element.id" @click="selected(element.name,element.id, element.url)">-->
<!--					 <i class="el-icon-document"></i>-->
<!--					 <span>{{element.name}}</span>-->
<!--				</el-menu-item>-->
<!--			 </el-submenu>-->
		</template>
	</el-submenu>
</template>
<script>
    import subMenu from './submenu'
	export default {
		name: 'submenu',
		props: ['item','menuObj'],
		methods: {
			selected(tab, moduleId,url) {
				this.$emit('selected', tab, moduleId,url)
			}
		},
		mounted(){
		},
        components:{
            subMenu,
        }
	}
</script>
