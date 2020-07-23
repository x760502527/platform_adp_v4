import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Form, Input } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

// import CreateForm from './components/CreateForm';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import { TableListItem, ResetParams, TatentListItem } from './data.d';
import { queryRule, updateRule, querySingalUserInfo } from './service';

// 引入样式
import "../../assets/css/common/common.css";

// label 和 input 的布局
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 }
};
// 根据对象数组中对象的某个属性值去重方法
const removeSameFature = (arrData:TatentListItem[]) => {
  let arr = arrData.map((item) => {
    return {"id":item.id ,"entityid": item.entityid, "entityname": item.entityname}
  });
  let hash = {};
  // 根据租户entityid去重
  arr = arr.reduce((arr:any, item:any) => {
    hash[item.entityid] ? '' : hash[item.entityid] = true && arr.push(item);
    return arr
  }, []);
  return arr;
}

const TableList: React.FC<{}> = () => {
  // 新建账户的modal是否可见
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 重置密码的modal是否可见
  const [resetPassword, setResetModalVisible] = useState<boolean>(false);
  // 修改账户信息的modal是否可见
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 设置修改表单组件的表单初始值
  const [stepFormValues, setStepFormValues] = useState({});
  // 分页器的total值
  const [total, setTotal] = useState<number>(0);
  // 所有的租户数组
  const [entitys, setEntitys] = useState<any[]>([]);
  // 新建账户是否成功
  const [isSuccess, setSuccess] = useState(false);
  // 存入当前点击的record
  const [recordItem, setRecordItem] = useState<ResetParams>({id: 0, usercode: '', pwd: ''});
  
  const actionRef = useRef<ActionType>();
  // 获取form
  const [form] = Form.useForm();
  // 成功创建后的回调
  useEffect(() => {
    if(isSuccess) {
      actionRef.current?.reloadAndRest();
    }
  }, [isSuccess]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      sorter: true,
      hideInSearch: true
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
              querySingalUserInfo(record.id).then(res => {
                if(res.mesg === 'successful') {
                  setUpdateModalVisible(true);
                  setStepFormValues(res.data);
                } else {
                  message.error(res.mesg);
                }
              }).catch(err => {
                message.error('打开页面失败，请刷新页面后重试');
              }); 
            }}
          >
            详情
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setRecordItem(record);
              setResetModalVisible(true);
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
          <Button type="primary" onClick={() => setCreateModalVisible(true)}>
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
        pagination={{defaultCurrent:1, total}}
        request={(params:any, sorter, filter) => {
          queryRule(params).then(res => {
            // 记录请求回来的数据条数，稍后传入表格的分页器
            setTotal(res.total);
            // 去重并记录租户角色，稍后传入CreateForm表单中
            let arr = removeSameFature(res.data);
            setEntitys([...arr]);
          }).catch(err => {
            console.log(err)
          });
          // 返回Promise
          return queryRule(params);
        }}
        columns={columns}
        rowSelection={{}}
        onRequestError={(err) => {message.error('数据请求出错，请刷新页面后重试！')}}
      />
      
      <ResetPasswordForm
        modalVisible={resetPassword}
        onCancel={() => setResetModalVisible(false)}
        onSubmit={() => {
          let usercode = form.getFieldsValue().usercode;
          updateRule({id: recordItem.id, pwd: form.getFieldValue('pwd'), usercode}).then(res => {
            message.success('修改密码成功');
            setResetModalVisible(false);
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
        onCancel={() => setCreateModalVisible(false)}
        createModalVisible={createModalVisible}
        isSuccess={(val:boolean) => {
          setSuccess(val)
        }}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          allEntity={entitys}
          onCancel={() => {
            setUpdateModalVisible(false);
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
