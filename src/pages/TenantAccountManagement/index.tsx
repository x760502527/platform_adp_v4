import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Form, Input } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

// import CreateForm from './components/CreateForm';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule } from './service';

// 引入样式
import "../../assets/css/common/common.css";

// label 和 input 的布局
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 }
};

// 重置密码的接口
interface ResetParams {
  id?: number;
  usercode?: string;
  pwd?: string;
}

const TableList: React.FC<{}> = () => {
  // 新建的modal是否可见
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // 重置密码的modal是否可见
  const [resetPassword, handleResetModalVisible] = useState<boolean>(false);
  // 修改账户信息的modal是否可见
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // 设置每一步表单的值
  const [stepFormValues, setStepFormValues] = useState({});
  // 分页器的total值
  const [total, handlerTotal] = useState<number>(0);
  // 所有的租户名称数组
  const [entitys, setEntitys] = useState<any[]>([]);
  // 新建账户是否成功
  const [isSuccess, setSuccess] = useState(false);
  // 存入当前点击的record
  const [recordItem, setRecordItem] = useState<ResetParams>({id: 0, usercode: '', pwd: ''});
  // 重置密码表单的值
  // const [resetPwdForm, setResetPwdForm] = useState({});
  const actionRef = useRef<ActionType>();
  // 获取form
  const [form] = Form.useForm();
  useEffect(() => {
    if(isSuccess) {
      actionRef.current?.reload();
    }
  });
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      sorter: true,
      hideInSearch: true,
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '租户名称',
      dataIndex: 'entityname',
      valueType: 'textarea'
    },
    {
      title: '用户名',
      dataIndex: 'usercode'
    },
    {
      title: '姓名',
      dataIndex: 'realname'
    },
    {
      title: '手机号码',
      dataIndex: 'cellphone'
    },
    {
      title: '用户状态',
      dataIndex: 'userstatus'
    },
    {
      title: '租户ID',
      dataIndex: 'entityid',
      hideInTable: true
    },
    {
      title: '用户类型',
      dataIndex: 'usertype',
      hideInTable: true,
      valueEnum: {
        [1]: {
          text: '主账号',
          status: 1,
        },
        [0]: {
          text: '子账号',
          status: 0,
        },
      }
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
            详情
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setRecordItem(record);
              handleResetModalVisible(true);
            }}
          >
            重置密码
          </a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        rowClassName={(record, index) => {return index%2=== 1?"rowWhite":"rowDeep"}}
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
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        pagination={{defaultCurrent:1,total}}
        request={(params:any, sorter, filter) => {
          queryRule({...params}).then(res => {
            handlerTotal(res.total);
            // 将租户信息传入新建租户账户页面中
            let arr = res.data.map(item => {
              return {"id":item.id ,"entityid": item.id, "entityname": item.entityname}
            });
            setEntitys([...arr]);
          });
          return queryRule({...params});
        }}
        columns={columns}
        rowSelection={{}}
        onRequestError={(err) => {message.error('数据请求出错，请刷新页面后重试！')}}
      />
      
      <ResetPasswordForm
        modalVisible={resetPassword}
        onCancel={() => handleResetModalVisible(false)}
        onSubmit={() => {
          let usercode = form.getFieldsValue().usercode;
          updateRule({id: recordItem.id, pwd: recordItem.pwd, usercode}).then(res => {
            message.success('修改密码成功');
            handleResetModalVisible(false);
          }).catch(err => {
            message.error('修改密码失败，请刷新页面后重试');
          })
        }}
      >
        <Form
        form={form}
        labelAlign="left"
        {...formLayout}
        initialValues={
          {
            usercode: recordItem?.usercode
          }
        }
        >
          <Form.Item 
            label="用户名" 
            name="usercode" 
            rules={[{ required: true, message: '唯一标识，由英文字符、数字组成，长度<10个字符' }]}
            extra="唯一标识，由英文字符、数字组成，长度<10个字符">
            <Input value={recordItem?.usercode} />
          </Form.Item>
          <Form.Item 
            label="新密码" 
            name="pwd" 
            rules={[{ required: true, message: '必填，长度<30个字' }]}
            extra="必填，长度<30个字">
            <Input.Password visibilityToggle={false} />
          </Form.Item>
          <Form.Item 
            label="确认密码"
            name="samePwd" 
            rules={[{ required: true, message: '再次输入密码，和新密码保持一致' }]}
            extra="再次输入密码，和新密码保持一致"
            >
            <Input.Password visibilityToggle={false} />
          </Form.Item>
        </Form>
      </ResetPasswordForm>
      <CreateForm
        allEntity={entitys}
        onSubmit={async (value) => {
          console.log(value);
        }}
        onCancel={() => handleModalVisible(false)}
        updateModalVisible={createModalVisible}
        values={stepFormValues}
        isSuccess={(val:boolean) => {
          setSuccess(val)
        }}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          allEntity={entitys}
          onSubmit={async (value) => {
            console.log('成功')
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          isSuccess={(val:boolean) => {
            setSuccess(val)
          }}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
