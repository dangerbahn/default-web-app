
export default {
  apis: {
    api: {
      key: '<%-API_KEY%>',
      host: 'http://some-api.herokuapp.com',
      namespace: '',
      dataType: 'jsonp'
    }
  },
  mq: {
    sm: '<%=breakPoints.sm%>px',
    md: '<%=breakPoints.md%>px',
    lg: '<%=breakPoints.lg%>px',
    xl: '<%=breakPoints.xl%>px'
  }
};
