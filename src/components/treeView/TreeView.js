import { Tree, Icon  } from 'antd';
import React from 'react';
const { TreeNode } = Tree;

const treeData = [{
  title: '北京市',
  key: '0-0',
  children: [{
    title: '京南',
    key: '0-0-0'
  }, {
    title: '丰台花园',
    key: '0-0-1'
  }, {
    title: '顺义',
    key: '0-0-2'
  }, {
    title: '延庆',
    key: '0-0-3'
  }, {
    title: '平谷',
    key: '0-0-4'
  }, {
    title: '房山',
    key: '0-0-5'
  }, {
    title: '亦庄',
    key: '0-0-6'
  }, {
    title: '云岗',
    key: '0-0-7'
  }, {
    title: '天坛',
    key: '0-0-8'
  }, {
    title: '永定门',
    key: '0-0-9'
  }, {
    title: '京东北',
    key: '0-0-10'
  }, {
    title: '怀柔',
    key: '0-0-11'
  }, {
    title: '京西北',
    key: '0-0-12'
  }, {
    title: '万寿西宫',
    key: '0-0-13'
  }, {
    title: '昌平',
    key: '0-0-14'
  }, {
    title: '门头沟',
    key: '0-0-15'
  }, {
    title: '通州',
    key: '0-0-16'
  }, {
    title: '大兴',
    key: '0-0-17'
  }, {
    title: '定陵',
    key: '0-0-18'
  }, {
    title: '前门',
    key: '0-0-19'
  }, {
    title: '官园',
    key: '0-0-20'
  }, {
    title: '东四',
    key: '0-0-21'
  }, {
    title: '香山',
    key: '0-0-22'
  }, {
    title: '奥体中心',
    key: '0-0-1'
  }, {
    title: '农展馆',
    key: '0-0-1'
  }, {
    title: '密云',
    key: '0-0-1'
  }, {
    title: '古城',
    key: '0-0-1'
  }, {
    title: '南三环',
    key: '0-0-1'
  }, {
    title: '北部新区',
    key: '0-0-1'
  }, {
    title: '万柳',
    key: '0-0-1'
  }, {
    title: '京东南',
    key: '0-0-1'
  }, {
    title: '京西南',
    key: '0-0-1'
  }, {
    title: '京东',
    key: '0-0-1'
  }, {
    title: '东四环',
    key: '0-0-1'
  }, {
    title: '西直门',
    key: '0-0-1'
  }]
}];

class TreeView extends React.Component {
  state = {
    expandedKeys: ['0-0-0', '0-0-1'],
    autoExpandParent: true,
    checkedKeys: ['0-0-0'],
    selectedKeys: [],
  }

  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })

  render() {
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    );
  }
}

export default TreeView;

