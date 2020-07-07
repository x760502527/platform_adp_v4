import React from 'react';
import {Modal} from 'antd';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  // console.log(props)
  const { modalVisible, onCancel} = props;
  // console.log(children)
  // const [ closeModel, isClose ] = useState(false)
  // const onSubmit = function():void {
  //   console.log(closeModel)
  //   isClose(true)
  //   onCancel()
  // }
  return (
    <Modal
      width={984}
      destroyOnClose
      title="创建版本"
      onCancel={onCancel}
      visible={modalVisible}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};
export default CreateForm;
