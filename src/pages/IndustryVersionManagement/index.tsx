import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input,Form, Row, Col, Select} from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import Tree from './components/Tree';
import '../../assets/css/IndustryVersionManagement/index.css'

import { TableListItem } from './data.d';
import { queryRule, removeRule } from './service';
// import { FormInstance } from 'antd/lib/form';
// import UpdateForm from './components/UpdateForm';

const { Option } = Select;
const FormItem = Form.Item;

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
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
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
  const [showTenantSearch,hideTenantSearch] = useState<boolean>(true)
  // const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'industyTableid',
      sorter: true,
      hideInSearch: true
    },
    {
      title: '角色属性',
      dataIndex: 'roleProp',
      renderFormItem: () => {
        return (
          <Select 
          placeholder="请选择角色" 
          onChange={val => { hideTenantSearch(val == 'version' ? true : false)}}>
            <Option value="version">行业版本</Option>
            <Option value="role">用户角色</Option>
          </Select>
       )
      }
    },
    {
      title: '租户',
      dataIndex: 'tenant',
      sorter: true,
      hideInSearch: showTenantSearch,
      hideInTable: true,
      formItemProps: {
        placeholder:"请输入租户账号"
      }
    },
    {
      title: '行业版本名称',
      dataIndex: 'roleName',
      formItemProps: {
        placeholder:"请输入行业版本名称"
      }
    },
    {
      title: '备注',
      dataIndex: 'note',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              // setStepFormValues(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a style={{color:'#FF4B40'}} href="">删除</a>
        </>
      ),
    },
  ];

  // const addColumns: ProColumns<TableListItem>[] = [
  //   {
  //     title: '行业版本名称',
  //     dataIndex: 'name',
  //     rules: [
  //       {
  //         required: true,
  //         message: '规则名称为必填项',
  //       },
  //     ],
  //   },
  // ];
  //   <Card style={{margin: '0 0 15px'}}>
  //   <Form style={{margin: '15px 0 0'}}>
  //     <Row gutter={16} align="middle">
  //       <Col span={6}>
  //         <FormItem label="租户">
  //           <Input  />
  //         </FormItem>
  //       </Col>
  //       <Col span={6}>
  //         <FormItem label="角色属性">
  //           <Input  />
  //         </FormItem>
  //       </Col>
  //       <Col span={6}>
  //         <FormItem label="角色名称">
  //           <Input  />
  //         </FormItem>
  //       </Col>
  //     </Row>
  //   </Form>
  // </Card>
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>  
        headerTitle="行业版本列表"
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
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          false
        )}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <Form name="control-ref">
          <Row>
            <Col span="12">
              <Form.Item name="note" label="行业版本名称" rules={[{ required: true }]}>
                <Input />  
              </Form.Item>
            </Col>
          </Row>
          <FormItem>
            <Tree />
          </FormItem>
        </Form>
      </CreateForm>

      <CreateForm onCancel={() => handleUpdateModalVisible(false)} modalVisible={updateModalVisible}>
        <Form name="control-ref">
          <Row>
            <Col span="10">
              <Form.Item name="note" label="角色编码" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
             </Col>
            <Col span="10" offset="2">
              <Form.Item name="note" label="角色名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <FormItem>
            <Tree />
          </FormItem>
        </Form>
      </CreateForm>
    </PageHeaderWrapper>
  );
};

export default TableList;
