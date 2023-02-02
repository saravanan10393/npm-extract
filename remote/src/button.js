import React from 'react';
import dayjs from 'dayjs';

const style = {
  background: '#00c',
  color: '#fff',
  padding: 12,
};

const Button = () => <button style={style}>App 2 Button {dayjs("12-12-2012").format("DD/MM/YYYY")}</button>;

export default Button;