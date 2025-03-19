// export const CsvHeaders = [
//   {
//     label: "Serial No.",
//     key: "sNo",
//   },
//   {
//     label: "Name",
//     key: "firstName",
//   },
//   {
//     label: "Email",
//     key: "email",
//   },
//   {
//     label: "Department",
//     key: "departmentTitle",
//   },
//   {
//     label: "User Type",
//     key: "userTypeTitle",
//   },
//   {
//     label: "Organization",
//     key: "OrganizationName",
//   },
// ];
// export const Columns = [
//   {
//     title: "Name",
//     dataIndex: "firstName",
//     key: "firstName",
//     sorter: (a, b) =>
//       a?.firstName?.toLowerCase()?.localeCompare(b.firstName?.toLowerCase()),
//   },
//   {
//     title: "Email",
//     dataIndex: "email",
//     key: "email",
//     sorter: (a, b) => a?.email?.toLowerCase() === b?.email?.toLowerCase(),
//   },
//   {
//     title: "Department",
//     dataIndex: "departmentTitle",
//     key: "departmentTitle",
//     sorter: (a, b) =>
//       a?.departmentTitle
//         ?.toLowerCase()
//         ?.localeCompare(b.departmentTitle?.toLowerCase()),
//   },
//   {
//     title: "User Type",
//     dataIndex: "userTypeTitle",
//     key: "userTypeTitle",
//     sorter: (a, b) =>
//       a?.userTypeTitle
//         ?.toLowerCase()
//         ?.localeCompare(b?.userTypeTitle?.toLowerCase()),
//   },
//   {
//     title: "Organization",
//     dataIndex: "OrganizationName",
//     sorter: (a, b) =>
//       a?.OrganizationName?.toLowerCase()?.localeCompare(
//         b.OrganizationName?.toLowerCase()
//       ),
//     key: "OrganizationName",
//   },
// ];
export const FormData = {
  submit_url: "/api/user/create",
  form: [
    {
      id: "1",
      type: "text",
      required: true,
      isUpdate: true,
      label: "First Name",
      name: "firstName",
      placeHolder: "Enter First Name",
      value: "",
      errorMessage: "Enter Valid First Name !",
      regex: /^[a-zA-z]+([\\s][a-zA-Z]+)*$/,
    },
    {
      id: "2",
      type: "text",
      required: false,
      isUpdate: true,
      name: "lastName",
      label: "Last Name",
      popupText: "",
      helpNote: "",
      placeHolder: "Enter Last Name",
      errorMessage: "Enter valid Last Name",
      regex: /^[a-zA-z]+([\\s][a-zA-Z]+)*$/,
      value: "",
      validators: {
        required: true,
        minLength: 10,
      },
    },
    {
      id: "3",
      type: "text",
      required: true,
      isUpdate: false,
      name: "email",
      label: "Official Email",
      popupText: "",
      helpNote: "",
      placeHolder: "Enter Official Email",
      errorMessage: "Enter valid Email",
      regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      value: "",
    },
    {
      id: "4",
      type: "password",
      required: false,
      isUpdate: false,
      label: "password",
      name: "password",
      popupText: "",
      errorMessage: "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      placeHolder: "Enter New Password",
      helpNote: "",
      value: "",
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.+!@#\$%\^&\*])/,
    },
    {
      id: "5",
      type: "Select",
      required: true,
      isUpdate: false,
      label: "Select City",
      name: "select",
      popupText: "",
      errorMessage: "Please select an option.",
      placeHolder: "Select",
      helpNote: "",
      value: {value:'',label:''},
      regex: /./ ,
    },
  ],
};
