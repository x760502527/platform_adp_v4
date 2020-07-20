import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Form, Input, Select } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

// import CreateForm from './components/CreateForm';
import CreateForm, { FormValueType } from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, removeRule } from './service';

// 引入样式
import "../../assets/css/common/common.css";
import { values } from 'lodash';

// 从Select组件中拿到Option
// const { Option } = Select;

/**
 * 添加节点
 * @param fields
 */
// const handleAdd = async (fields: TableListItem) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addRule({ ...fields });
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };

/**
 * 更新节点
 * @param fields
 */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('正在配置');
//   try {
//     // await updateRule({
//     //   name: fields.name,
//     //   desc: fields.desc,
//     //   key: fields.key,
//     // });
//     hide();

//     message.success('配置成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    // await removeRule({
    //   key: selectedRows.map((row) => row.key),
    // });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

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
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [resetPassword, handleResetModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
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
  const [resetPwdForm, setResetPwdForm] = useState({});
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
              handleResetModalVisible(true);
              setRecordItem(record);
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
                      await handleRemove(selectedRows);
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
            })
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
        // formData={form.getFieldsValue()}
        onSubmit={() => {
          console.log(form.getFieldsValue());
          updateRule({id: recordItem.id, pwd: recordItem.pwd}).then(res => {
            console.log(res);
            message.success('修改密码成功')
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
