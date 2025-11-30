import { Switch, Typography } from 'antd';

const { Text } = Typography;

interface Props { isChecked?: boolean, onToggle?: (e: boolean) => any, label?: string }

const ToggleSwitch = ({ onToggle, isChecked, label }: Props) => {

  return (
    <div style={{ padding: '20px' }}>
      <Text>{label}</Text>
      <br />
      <Switch checked={isChecked} onChange={(e) => onToggle && onToggle(e)} />
    </div>
  );

};

export default ToggleSwitch;
