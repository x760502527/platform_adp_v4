import React, { useState, useRef } from 'react';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Form, Button, Input, Modal, Radio, Select, Steps, Row, Col, Divider, Checkbox, message } from 'antd';

import { updateRule } from '../service';
import { TableListItem } from '../data.d';

// 引入样式
import '../../../assets/css/TenantAccountManager/index.css';
// 表单值的接口
export interface FormValueType {
  userstatus?: number;
  realname?: string;
  usercode?: string;
  cellphone?: number;
  pwd?: string;
}
// 接收的props接口
export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  allEntity: string[];
  isSuccess: (val:boolean) => void;
}

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface EntirysInfo {
  entityname: string;
  entityid: number;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [entityInfo, setEntityInfo] = useState<EntirysInfo>({entityid: 0, entityname: ''});
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    allEntity
  } = props;
  // 创建表单的实例
  const [form] = Form.useForm();
  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async (val:any) => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    if (currentStep < 2) {
      forward();
    } else {
      handleUpdate({ ...formVals });
    }
  };

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <> 
          <Row className="tenant-account-info">
            <Col span="12">
              <span className="label">商家选择：</span>
              <span className="info">{entityInfo.entityname}</span>
            </Col>
            <Col span="12">
              <span className="label">区域机构：</span>
              <span className="info">内容内容内容内容</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="12">
              <span className="label">登录用户名：</span>
              <span className="info">{form.getFieldsValue().usercode}</span>
            </Col>
            <Col span="12">
              <span className="label name">姓</span><span className="name-end">名：</span>
              <span className="info">{form.getFieldsValue().realname}</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="12">
              <span className="label">登录密码：</span>
              <span className="info">{form.getFieldsValue().pwd}</span>
            </Col>
            <Col span="12">
              <span className="label">手机号码：</span>
              <span className="info">{form.getFieldsValue().cellphone}</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="24">
              <span className="label">是否冻结：</span>
              <span className="info">
                {
                  form.getFieldsValue().userstatus === 0 ? "正常" : "冻结"
                }
              </span>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span="24">
              {

              }
            </Col>
          </Row>
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <Row justify="center" align="middle" className="done-container">
            <Col span="7" >
              <CheckCircleTwoTone twoToneColor="#52c41a" className="done-icon" />
              <span className="done-title">操作成功</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="12">
              <span className="label">商家选择：</span><span className="info">填写信息填写信息填写信息</span>
            </Col>
            <Col span="12">
              <span className="label">区域机构：</span><span className="info">填写信息填写信息填写信息</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="12">
              <span className="label">登录用户名：</span><span className="info">SHKLSFLKLSLL</span>
            </Col>
            <Col span="12">
              <span className="label name">姓</span><span className="name-end">名：</span><span className="info">填写信</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="12">
              <span className="label">登录密码：</span><span className="info">AAAAAAAA</span>
            </Col>
            <Col span="12">
              <span className="label">手机号码：</span><span className="info">131-3546-1547</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="24">
              <span className="label">是否冻结：</span><span className="info">公开</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="24">
              <span className="label">租户权限：</span><span className="info">管理员，超级管理员，管理员，超级管理员，管理员，超级管理员，管理员，超级管理员，管理员，超级管理员，管理员，超级管理员，管理员，超级管理员，管理员，超级管理员，管理员，超级管理员</span>
            </Col>
          </Row>
        </>
      );
    }
    return (
      <>
      <Row >
        <Col span="12">
          <FormItem
            name="id"
            label="租户选择"
            extra="请选择租户类型"
            rules={[{ required: true, message: '请选择租户类型' }]}
          >
            <Select placeholder="请选择">
              {
                allEntity.map((item:any) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.entityname}
                    </Option>
                  )
                })
              }
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            name="realname"
            label="姓名"
            extra="默认商家联系人，字母和汉字组成，长度<20个字"
            rules={[{ 
              required: true, 
              message: '默认商家联系人，字母和汉字组成，长度<20个字',
              pattern: new RegExp(/^[\u4e00-\u9fa5a-zA-Z]{1,20}$/)
            }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem
            name="usercode"
            label="电子邮箱"
            extra="不能重复，必填，长度<30个字"
            rules={[{ 
              required: true, 
              message: '不能重复，必填，长度<30个字',
              min: 1,
              max: 30
            }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            name="cellphone"
            label="手机号码"
            extra="不能为空，由3-16位英文字符、数字组成"
            rules={[{ 
              required: true, 
              message: '不能为空，由3-16位英文字符、数字组成',
              pattern: new RegExp(/^[0-9a-zA-Z]{3,16}$/)
            }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
      </Row>
        <Row>
          <Col span="12">
            <FormItem
              name="pwd"
              label="登录密码"
              extra="不能为空，由3-16位英文字符、数字组成"
              rules={[{ 
                required: true, 
                message: '不能为空，由3-16位英文字符、数字组成',
                pattern: new RegExp(/^[0-9a-zA-Z]{3,16}$/)
              }]}
            >
              <Input placeholder="请输入" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              name="userstatus"
              label="是否冻结"
              rules={[{ required: true, message: '请选择账户状态' }]}
            >
              <Radio.Group>
                <Radio value={0}>正常</Radio>
                <Radio value={1}>冻结</Radio>
              </Radio.Group>
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={() => handleUpdateModalVisible(false)}>取消</Button>
          <Button type="primary" onClick={() => {
            
            let params:any = {...formVals,id: values.id, ...entityInfo};
            console.log({...params})
            updateRule({...params}).then(res => {
              handleNext(form.getFieldsValue());
            }).catch(err => {
              message.error('创建账号失败，请刷新页面后重试')
            });
            }}>
            下一步
          </Button>
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <Button type="primary" onClick={() => {
            handleUpdateModalVisible(false, values);
            props.isSuccess(true);
            }}>
            关闭
          </Button>
        </>
      );
    }
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false)}>取消</Button>
        <Button type="primary" onClick={() => {
          handleNext(form.getFieldsValue());
          allEntity.forEach((item:any) => {
            if(item.id === form.getFieldValue('id')) {
              setEntityInfo({entityname: item.entityname, entityid: item.entityid});
            }
          })
          }}>
          下一步
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={866}
      className="create-account-modal"
      bodyStyle={{ padding: '32px 32px 50px' }}
      destroyOnClose
      title="新建租户"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
        <Step title="基本账户信息" />
        <Step title="选择账户权限" />
        <Step title="完成" />
      </Steps>
      <Form
        labelAlign="left"
        {...formLayout}
        form={form}
        className="create-account-form"
        initialValues={{
          id: values.entityid,
          realname: values.realname,
          usercode: values.usercode,
          cellphone: values.cellphone,
          pwd: values.pwd,
          userstatus: values.userstatus
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
