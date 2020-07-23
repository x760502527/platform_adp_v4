// 引入依赖库
import React, { useState, useRef } from 'react';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Form, Button, Input, Modal, Radio, Select, Steps, Row, Col, Divider, message } from 'antd';
// 引入网络请求
import { updateRule, queryRoleName, getDefaultRole, createUserRoles } from '../service';
// 引入接口
import { UpdateFormProps, FormValueType } from '../data.d';
// 引入样式
import '../../../assets/css/TenantAccountManager/index.css';

// 从antd中获取所需组件
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;

// 租户信息的接口
interface EntirysInfo {
  entityname: string;
  entityid: number;
}
// 步骤条的状态类型
enum StepsStatusType {
  error = "error",
  wait = "wait",
  process = "process",
  finish = "finish",
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  // 表单数据
  const [formVals, setFormVals] = useState<FormValueType>({});
  // 每一步的current
  const [currentStep, setCurrentStep] = useState<number>(0);
  // 当前步骤的status
  const [stepsStatus, setStepsStatus] = useState<StepsStatusType>(StepsStatusType.process);
  // 创建表单的实例
  const [form] = Form.useForm();
  // 租户信息
  const [entityInfo, setEntityInfo] = useState<EntirysInfo>({entityid: 0, entityname: ''});
  // 用户选择的角色
  const [selectRoles, setSelectRoles] = useState<any[]>([]);
  // 用户选择的角色id
  const [userPermissions, setUserPermissions] = useState(0);
  const userPer = useRef(0);
  // 用户角色名称
  const [roleName, setRoleName] = useState('');
  // 修改时的用户默认角色
  const [userDefaultRole, setUserDefaulRole] = useState(0);
  // props的解构赋值
  const {
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    allEntity
  } = props;
  // 步骤条前进和后退方法
  const forward = () => setCurrentStep(currentStep + 1);
  const backward = () => setCurrentStep(currentStep - 1);
  // 修改用户账号信息的请求方法
  const updateUserInfo = () => {
    form.validateFields().then(res => {
      allEntity.forEach((item:any) => {
        setEntityInfo({entityname: item.entityname, entityid: item.entityid});
        if(item.entityname === res.entityname) {
          console.log(res)
          let params = {...res};
          delete params.entityname;
          // 获取默认用户角色
          getDefaultRole(res.usercode).then(res => {
            if(res.success) {
              setUserDefaulRole(res.data.id)
            } else {
              message.error(res.mesg);
            }
          }).catch(err => {
            message.error('获取用户默认角色失败');
            setStepsStatus(StepsStatusType.error);
          }) 
          // 查询用户所属租户有哪些角色菜单
          queryRoleName({entityid: item.entityid}).then(res => {
            setSelectRoles(res.data);
          }).catch(err => {
            console.log(err);
            message.error('获取用户角色菜单出错，请刷新页面后重试');
            setStepsStatus(StepsStatusType.error);
          });
          // 发送更新账户请求
          updateRule({...params, id: values.id, entityid: item.entityid}).then(res => {
            console.log(res);
            if(res.success) {
              message.success('账号基本信息修改成功');
              // 获取用户信息并设置state
              setFormVals({...formVals, ...res.data})
              if (currentStep < 2) {
                forward();
              }
            } else {
              if(res.mesg !== 'successful') {
                message.error(res.mesg);
              } else {
                setStepsStatus(StepsStatusType.error);
                message.error('修改账号失败，请刷新页面后重试');
              }
            }
          }).catch(err => {
            setStepsStatus(StepsStatusType.error);
            message.error('修改账号失败，请刷新页面后重试');
          })
        }
      }) 
    }).catch(err => {
      console.log(err);
    })
  }
  // 修改用户账号角色的方法
  const updateUserRole = () => {
    if(userPer.current === 0) {
      createUserRoles({roleId: userDefaultRole, userCode: formVals.usercode}).then(res => {
        if(res.success) {
          message.success('账号配置角色成功');
          setRoleName(res.data.rolename);
          if (currentStep < 2) {
            forward();
          }
        } else {
          setStepsStatus(StepsStatusType.error);
          message.error('账号配置角色失败,请刷新后重试');
        }
      }).catch(err => {
        setStepsStatus(StepsStatusType.error);
        message.error('账号配置角色失败,请刷新后重试');
      });
    } else {
      createUserRoles({roleId: userPer.current, userCode: formVals.usercode}).then(res => {
        if(res.success) {
          message.success('账号配置角色成功');
          setRoleName(res.data.rolename);
          if (currentStep < 2) {
            forward();
          }
        } else {
          setStepsStatus(StepsStatusType.error);
          message.error('账号配置角色失败,请刷新后重试');
        }
      }).catch(err => {
        setStepsStatus(StepsStatusType.error);
        message.error('账号配置角色失败,请刷新后重试');
      });
    }
  }
  // 步骤条的渲染内容
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
              <span className="label">是否冻结：</span>
              <span className="info">
                {console.log(formVals)}
                {
                  formVals.userstatus === 0 ? "正常" : "冻结"
                }
              </span>
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
          <Divider />
          <Row>
          <div className="account-role-title">选择账号权限</div>
            <Col span="24">
              <Radio.Group defaultValue={userDefaultRole}>
                {
                  selectRoles.map(item => {
                    return (
                      <Radio key={item.id} value={item.id} onChange={(event) => {
                        setUserPermissions(event.target.value);
                        userPer.current = event.target.value;
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
              <span className="label">商家选择：</span>
              <span className="info">{entityInfo.entityname}</span>
            </Col>
            <Col span="12">
              <span className="label">是否冻结：</span>
              <span className="info">
                {
                  formVals.userstatus === 0 ? "正常" : "冻结"
                }
              </span>
            </Col>
          </Row>
          <Row className="tenant-account-info">
            <Col span="12">
              <span className="label">登录用户名：</span>
              <span className="info">{formVals.usercode}</span>
            </Col>
            <Col span="12">
              <span className="label name">姓</span>
              <span className="name-end">名：</span>
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
              <span className="label">租户权限：</span>
              <span className="info">{roleName}</span>
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
            name="entityname"
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
  // 步骤条的渲染底部
  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={() => handleUpdateModalVisible(false)}>取消</Button>
          <Button type="primary" onClick={() => updateUserRole()}>
            下一步
          </Button>
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <Button type="primary" onClick={() => {
            handleUpdateModalVisible(false);
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
        <Button type="primary" onClick={() => updateUserInfo()}>
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
      <Steps 
      style={{ marginBottom: 28 }} 
      size="small" 
      current={currentStep}
      status={stepsStatus}>
        <Step title="基本账户信息" />
        <Step title="选择账户权限" />
        <Step title="完成" />
      </Steps>
      <Form
        labelAlign="left"
        labelCol={{span: 5}}
        wrapperCol={{span: 17}}
        form={form}
        className="create-account-form"
        initialValues={{
          entityname: values.entityname,
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
