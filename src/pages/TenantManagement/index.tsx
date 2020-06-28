import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input, Form, Row, Col, Tabs } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule } from './service';


const layout = {
  // labelCol: { span: 0 },
  // wrapperCol: { span: 10 },
};

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '租户',
      dataIndex: 'name',
      hideInTable: true
    },
    {
      title: '租户名称',
      dataIndex: 'name',
      hideInTable: true
    },
    {
      title: '联系电话',
      dataIndex: 'name',
      hideInTable: true
    },
    {
      title: '电子邮箱',
      dataIndex: 'name',
      hideInSearch: true
    },
    {
      title: '租户名称',
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInSearch: true
    },
    {
      title: '姓名',
      dataIndex: 'callNo',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val: string) => `${val} 万`,
    },
    {
      title: '手机号',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        0: { text: '关闭', status: 'Default' },
        1: { text: '运行中', status: 'Processing' },
        2: { text: '已上线', status: 'Success' },
        3: { text: '异常', status: 'Error' },
      },
    },
    {
      title: '行业版本',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a style={{ color: '#FF4B40' }} href="">删除</a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="租户列表"
        actionRef={actionRef}
        rowKey="key"
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={false}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="基础资料" key="1">
            <Form name="control-ref" {...{ labelCol: { xs: { span: 24 }, sm: { span: 8 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 } } }}>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item help="唯一标识，由英文字符、数字组成，长度<64个字符" {...layout} name="note" label="E-mail" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item help="不能为空，由6~16位英文字符、数字组成" {...layout} name="note" label="初始密码" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item help="不能重复，必填，长度≤32个字" {...layout} name="note" label="租户名称" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item help="默认商家联系人，字母和汉字组成，长度<20个字" {...layout} name="note" label="姓名" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item help="不能为空，由11位数字组成" {...layout} name="note" label="手机号" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item help="请选择行业版本" {...layout} name="note" label="行业版本" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>

      </CreateForm>
        <UpdateForm
          modalVisible={updateModalVisible}
          onCancel={() => handleUpdateModalVisible(false)}>
          <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="基础资料" key="1">
            <Form name="control-ref" {...{ labelCol: { xs: { span: 24 }, sm: { span: 8 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 } } }}>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item help="唯一标识，由英文字符、数字组成，长度<64个字符" {...layout} name="note" label="E-mail" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item help="不能为空，由6~16位英文字符、数字组成" {...layout} name="note" label="初始密码" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item help="不能重复，必填，长度≤32个字" {...layout} name="note" label="租户名称" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item help="默认商家联系人，字母和汉字组成，长度<20个字" {...layout} name="note" label="姓名" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item help="不能为空，由11位数字组成" {...layout} name="note" label="手机号" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item help="请选择行业版本" {...layout} name="note" label="行业版本" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>

        </UpdateForm>
    </PageHeaderWrapper>
  );
};

export default TableList;
