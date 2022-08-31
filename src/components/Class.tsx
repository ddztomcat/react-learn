import React, { PureComponent } from "react";

// 装饰器为，组件添加age属性
function addAge(Target: Function) {
	Target.prototype.age = 11;
}
// 使用装饰圈
@addAge
class Class extends PureComponent {
	age?: number;
	aaaaaaaaa?: number;

	render() {
		return (
			<>
				<h2>
					我是撒大声gg地类1组件---{this.age}----{this.aaaaaaaaa}
				</h2>
			</>
		);
	}
}
Class.prototype.aaaaaaaaa = 1111;
export default Class;
