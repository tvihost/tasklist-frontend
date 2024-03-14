import * as React from 'react';
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from 'axios';

const Form = () => {
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState("danger");  
  const [alertText, setAlertText] = React.useState("");  
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const checkoutSchema = yup.object().shape({
    title: yup.string().max(255).required("Requerido"),
    description: yup.string().required("Requerido"),
  });
  
  const initialValues = {
    title: "",
    description: "",
  };

  const reset = () => {
    window.location.reload();
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    storeTask(values);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    if(severity === "success")
    {
      window.location.href = '/tasks';
    }

    if(severity === "danger")
    {
      window.location.reload();
    }

    setOpen(false);
  };

  async function storeTask(values){
    await axios.post('http://localhost:3000/tasks', values, { withCredentials: true })
    .then(response => {
      if(response.status === 201){
        setAlertText("Tarefa adicionada com sucesso.");
        setSeverity("success");
        handleOpen();
      }
    })
    .catch(error => {
      console.log(error);
      setAlertText("Falha ao adicionar tarefa. [ErrorMsg: "+error+"]");
      setSeverity("danger");
      handleOpen();
    });
  }

  return (
    <Box m="20px">
      <Header title="Adicionar Tarefa" subtitle="Adicionar uma tarefa a lista" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Título"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descrição"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Criar
              </Button>
              <Button type="button" color="inherit" onClick={reset} variant="contained" style={{marginLeft:5}}>
                Limpar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Form;
