import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input, Form, Row, Col, Tabs } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryEntityinfoList, addEntityinfo, updateEntityinfo, removeEntityinfo } from './service';
import { useForm } from 'antd/lib/form/Form';


const layout = {
  // labelCol: { span: 0 },
  // wrapperCol: { span: 10 },
};

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加');
  try {
    await addEntityinfo({ ...fields });
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
const handleUpdate = async (fields: any) => {
  const hide = message.loading('正在配置');
  try {
    await updateEntityinfo({
      ...fields
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
    await removeEntityinfo({
      entityId : selectedRows.map((row) => row.key),
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
  const formRef = useRef<any>();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '租户名称',
      dataIndex: 'entityname',
      hideInTable: true
    },
    {
      title: '联系电话',
      dataIndex: 'cellphone',
      hideInTable: true
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      hideInSearch: true
    },
    {
      title: '租户名称',
      dataIndex: 'entityname',
      valueType: 'textarea',
      hideInSearch: true
    },
    {
      title: '姓名',
      dataIndex: 'realname',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'cellphone',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '行业版本',
      dataIndex: 'rolename',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
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
              setUpdateFormValues(record)
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

  const setUpdateFormValues = (record:any)=>{
    updateForm.setFieldsValue(record)
  }
  
  const add = async ()=>{
    const fv=form.getFieldsValue()
    form.submit()
  }
  
  const onFinish = (values:any)=>{
    handleAdd(values)
  }

  const revise =(values:any)=>{
    handleUpdate(values)
  }


  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="租户列表"
        actionRef={actionRef}
        rowKey="entityId"
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
        request={async (params, sorter, filter) => {
          let cParams:any = {
            ...params,
            pageNum:params['current'],
            pageSize:params['pageSize']
          }
          cParams.current = null

          const datas = await queryEntityinfoList({ ...cParams, sorter, filter })
          return {
            data:datas['data']['list'],
            total:datas['data']['total'],
            success:datas['success']
          }
        }}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm onOk={() => add()} onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="基础资料" key="1">
            <Form onFinish={onFinish} form={form} name="control-ref"  {...{ labelCol: { xs: { span: 24 }, sm: { span: 6 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 18 } } }}>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item extra="唯一标识，由英文字符、数字组成，长度<64个字符" {...layout} name="email" label="E-mail" rules={[{ 
                    required: true,
                    message:'请输入E-mail'
                    },
                    { 
                      max: 64,
                      message:'长度小于64个字符'
                      },
                    { 

                      pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                      message:'请输入正确的邮箱账号'
                      }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item extra="不能为空，由6~16位英文字符、数字组成" {...layout} name="pwd" label="初始密码" rules={[{ 
                    required: true,
                    message:'请输入初始密码'
                    },
                    { 
                      pattern: /^([A-Za-z0-9_\-\.]){6,16}$/,
                      message:'请输入正确的密码格式'
                      }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item extra="不能重复，必填，长度≤32个字" {...layout} name="entityname" label="租户名称" rules={[{ 
                    required: true ,
                    message:'请输入租户名称'
                    },
                    { 
                      max: 64,
                      message:'长度小于32个字符'
                      },]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item extra="默认商家联系人，字母和汉字组成，长度<20个字" {...layout} name="realname" label="姓名" rules={[{ 
                    required: true ,
                    message:'请输入姓名'
                    },
                    { 
                      max: 20,
                      message:'长度小于20个字符'
                    }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item extra="不能为空，由11位数字组成" {...layout} name="cellphone" label="手机号" rules={[{ 
                    required: true,
                    message:'请输入手机号'
                    },
                    { 
                      pattern:/[0-9]{11}/,
                      message:'请输入正确的手机号格式'
                    }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item extra="请选择行业版本" {...layout} name="rolename" label="行业版本" rules={[{ 
                    required: true ,
                    message:'请输入行业版本'
                    }]}>
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
          <Tabs defaultActiveKey="2">
          <Tabs.TabPane tab="基础资料" key="2">
          <Form onFinish={revise} form={updateForm} name="control-ref"  {...{ labelCol: { xs: { span: 24 }, sm: { span: 6 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 18 } } }}>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item extra="唯一标识，由英文字符、数字组成，长度<64个字符" {...layout} name="email" label="E-mail" rules={[{ 
                    required: true,
                    message:'请输入E-mail'
                    },
                    { 
                      max: 64,
                      message:'长度小于64个字符'
                      },
                    { 

                      pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                      message:'请输入正确的邮箱账号'
                      }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item extra="不能为空，由6~16位英文字符、数字组成" {...layout} name="pwd" label="初始密码" rules={[{ 
                    required: true,
                    message:'请输入初始密码'
                    },
                    { 
                      pattern: /^([A-Za-z0-9_\-\.]){6,16}$/,
                      message:'请输入正确的密码格式'
                      }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item extra="不能重复，必填，长度≤32个字" {...layout} name="entityname" label="租户名称" rules={[{ 
                    required: true ,
                    message:'请输入租户名称'
                    },
                    { 
                      max: 64,
                      message:'长度小于32个字符'
                      },]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item extra="默认商家联系人，字母和汉字组成，长度<20个字" {...layout} name="realname" label="姓名" rules={[{ 
                    required: true ,
                    message:'请输入姓名'
                    },
                    { 
                      max: 20,
                      message:'长度小于20个字符'
                    }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16,16]}>
                <Col span={12}>
                  <Form.Item extra="不能为空，由11位数字组成" {...layout} name="cellphone" label="手机号" rules={[{ 
                    required: true,
                    message:'请输入手机号'
                    },
                    { 
                      pattern:/[0-9]{11}/,
                      message:'请输入正确的手机号格式'
                    }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item extra="请选择行业版本" {...layout} name="rolename" label="行业版本" rules={[{ 
                    required: true ,
                    message:'请输入行业版本'
                    }]}>
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
