import React, { useState } from 'react';
import { Modal } from 'antd';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  console.log(props)
  const { modalVisible, onCancel, children } = props;
  console.log(children)
  const [ closeModel, isClose ] = useState(false)
  const onSubmit = function():void {
    console.log(closeModel)
    isClose(true)
    onCancel()
  }
  return (
    <Modal
      width={984}
      destroyOnClose
      title="创建版本"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={onSubmit}
    >
      {props.children}
    </Modal>
  );
};
export default CreateForm;
