import React, { useState } from 'react';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Form, Button, Input, Modal, Radio, Select, Steps, Row, Col, Divider, Checkbox } from 'antd';

import { TableListItem } from '../data.d';

// 引入样式
import '../../../assets/css/TenantAccountManager/index.css'

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
  tenant?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;
const { Step } = Steps;
// const { TextArea } = Input;
const { Option } = Select;
// const RadioGroup = Radio.Group;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    name: props.values.name,
    desc: props.values.desc,
    key: props.values.key,
    target: '0',
    template: '0',
    type: '1',
    time: '',
    frequency: 'month',
  });

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    setFormVals({ ...formVals, ...fieldsValue });

    if (currentStep < 2) {
      forward();
    } else {
      handleUpdate({ ...formVals, ...fieldsValue });
    }
  };

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <> 
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
          <Divider />
          <Row>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem name="tenant">
                <Checkbox>Apple</Checkbox>
              </FormItem>
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
            name="tenant"
            label="租户选择"
            extra="请选择租户类型"
            rules={[{ required: true, message: '请选择租户类型' }]}
          >
            <Select placeholder="请选择">
              <Option value="Option1">租户1</Option>
              <Option value="Option2">租户2</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            name="name"
            label="姓名"
            extra="默认商家联系人，字母和汉字组成，长度<20个字"
            rules={[{ required: true, message: '默认商家联系人，字母和汉字组成，长度<20个字' }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem
            name="email"
            label="电子邮箱"
            extra="不能重复，必填，长度<30个字"
            rules={[{ required: true, message: '不能重复，必填，长度<30个字' }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            name="phoneNum"
            label="手机号码"
            extra="不能为空，由3-16位英文字符、数字组成"
            rules={[{ required: true, message: '不能为空，由3-16位英文字符、数字组成' }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
      </Row>
        <Row>
          <Col span="12">
            <FormItem
              name="password"
              label="登录密码"
              extra="不能为空，由3-16位英文字符、数字组成"
              rules={[{ required: true, message: '不能为空，由3-16位英文字符、数字组成' }]}
            >
              <Input placeholder="请输入" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              name="accountStatus"
              label="是否冻结"
              rules={[{ required: true, message: '请选择账户状态' }]}
            >
              <Radio.Group>
                <Radio value={1}>正常</Radio>
                <Radio value={0}>冻结</Radio>
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
          <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            下一步
          </Button>
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          {/* <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button> */}
          <Button type="primary" onClick={() => handleUpdateModalVisible(false, values)}>
            关闭
          </Button>
        </>
      );
    }
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
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
          target: formVals.target,
          template: formVals.template,
          type: formVals.type,
          frequency: formVals.frequency,
          name: formVals.name,
          desc: formVals.desc,
          tenant: formVals.tenant
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
