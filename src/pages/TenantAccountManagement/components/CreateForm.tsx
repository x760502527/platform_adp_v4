import React, { useState, useRef, useEffect } from 'react';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Form, Button, Input, Modal, Radio, Select, Steps, Row, Col, Divider, message } from 'antd';
// 引入网络请求
import { addRule, queryRoleName, createUserRoles} from '../service';

// 引入样式
import '../../../assets/css/TenantAccountManager/index.css';
// 用户所填表格接口
export interface FormValueType {
  userstatus?: number;
  realname?: string;
  usercode?: string;
  cellphone?: number;
  pwd?: string;
  id?: string;
  entityname?: string;
  entityid?: string;
}

export interface CreateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  createModalVisible: boolean;
  allEntity: string[];
  isSuccess: (val:boolean) => void;
}

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

// 从antd中获取所需组件
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;

interface EntirysInfo {
  entityname: string;
  entityid: string;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({});

  const [currentStep, setCurrentStep] = useState<number>(0);
  // 创建form实例
  const [form] = Form.useForm();
  // 版本信息
  const [entityInfo, setEntityInfo] = useState<EntirysInfo>({entityid: '', entityname: ''});

  const [selectRoles, setSelectRoles] = useState<any[]>([]);
  // 新增用户的权限
  const [userPermissions, setUserPermissions] = useState(0);
  // 解构赋值
  const {
    onSubmit: handleCreate,
    onCancel: handleCreateModalVisible,
    createModalVisible,
    allEntity
  } = props;
  useEffect(() => {
    
    console.log(allEntity)
  }, [allEntity]);
  const forward = () => setCurrentStep(currentStep + 1);
  const backward = () => setCurrentStep(currentStep - 1);
  // 点击下一步执行
  const handleNext = async () => {
    // 验证所有字段并获取字段数据
    const fieldsValue = await form.validateFields()
    // 设置表单的所有值
    setFormVals({ ...formVals, ...fieldsValue });
    // 下一步操作
    if (currentStep < 2) {
      forward();
    } else {
      handleCreate({ ...formVals,...fieldsValue });
    }
  };
  // 发送表单数据
  const sendFormData = () => {
    allEntity.forEach((item:any) => {
      if(item.id === form.getFieldValue('id')) {
        queryRoleName({entityid: item.entityid}).then(res => {
          setSelectRoles(res.data);
        }).catch(err => {
          message.error('获取用户角色菜单出错，请刷新页面后重试')
        });
        setEntityInfo({entityname: item.entityname, entityid: item.entityid});
        form.validateFields().then(res => {
          setFormVals({ entityname: item.entityname, entityid: item.entityid, ...res });
          let params:any = { entityname: item.entityname, entityid: item.entityid, ...res };
          delete params.id;
          addRule({...params}).then(res => {
            message.success('账号基本信息创建成功');
          }).catch(err => {
            message.error('创建账号失败，请刷新页面后重试')
          });
        })
      }
    });
    if (currentStep < 2) {
      forward();
    }
  }
  // 渲染的内容
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
              <span className="info">{formVals.usercode}</span>
            </Col>
            <Col span="12">
              <span className="label name">姓</span><span className="name-end">名：</span>
              <span className="info">{formVals.realname}</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="12">
              <span className="label">登录密码：</span>
              <span className="info">{formVals.pwd}</span>
            </Col>
            <Col span="12">
              <span className="label">手机号码：</span>
              <span className="info">{formVals.cellphone}</span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="24">
              <span className="label">是否冻结：</span>
              <span className="info">
                {
                  formVals.userstatus === 0 ? "正常" : "冻结"
                }
              </span>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span="24">
              <Radio.Group>
                {console.log(selectRoles)}
                {

                  selectRoles.map(item => {
                    
                    return (
                      <Radio key={item.id} value={item.id} onChange={(event) => {
                        setUserPermissions(event.target.value);
                      }}>
                        {item.rolename}
                      </Radio>
                    )
                  })
                }
              </Radio.Group>
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
            rules={
              [{ 
                required: true, 
                message: '默认商家联系人，字母和汉字组成，长度<20个字',
                pattern: new RegExp(/^[\u4e00-\u9fa5a-zA-Z]{1,20}$/)
              }]
            }
          >
            <Input placeholder="请输入"/>
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
            <Input placeholder="请输入"/>
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
          <Button onClick={() => handleCreateModalVisible(false)}>取消</Button>
          <Button type="primary" onClick={() => {
            createUserRoles({roleId: userPermissions, userCode: formVals.usercode}).then(res => {
              if(res.success) {
                message.success('账号配置角色成功');
                handleNext()
              }
            }).catch(err => {
              message.success('账号配置角色失败')
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
            handleCreateModalVisible(false);
            props.isSuccess(true);
            }}>
            关闭
          </Button>
        </>
      );
    }
    return (
      <>
        <Button onClick={() => handleCreateModalVisible(false)}>取消</Button>
        <Button type="primary" onClick={() => sendFormData()}>
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
      visible={createModalVisible}
      footer={renderFooter()}
      onCancel={() => handleCreateModalVisible()}
    >
      <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
        <Step title="基本账户信息" />
        <Step title="选择账户权限" />
        <Step title="完成" />
      </Steps>
      <Form
        labelAlign="left"
        labelCol={{ span: 5} }
        wrapperCol= {{span: 17 }}
        form={form}
        className="create-account-form"
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateForm;
