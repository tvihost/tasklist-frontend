import React, { useState, useEffect } from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { InputLabel } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import axios from 'axios';

const EditModal = ({ open, handleClose, rowData }) => {

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [status, setStatus] = useState(null);
  const [id, setId] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("danger");  
  const [alertText, setAlertText] = useState("");

  const handleSave = () => {
    // Save edited data
    if(!hasDataChanged())
    {
      handleClose();
      return;
    }
    
    updateTask(id);

  };

  useEffect(() => {
    if(!rowData){
      return;
    }
    setTitle(rowData.title);
    setDescription(rowData.description);
    setStatus(rowData.status);
    setId(rowData.id);

  }, []);

  const handleOpen = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if(severity === "success")
    { 
      window.location.reload();
    }
  };

  const hasDataChanged = () => {
    let changed = false;
    if(title !== rowData.title || description !== rowData.description || status !== rowData.status)
      changed = true;
    return changed;
  };

  async function updateTask(id){
    const putData = {
      title: title,
      description: description,
      status: status
    }

    await axios.put('http://localhost:3000/tasks/'+id, putData, { withCredentials: true })
    .then(response => {
      if(response.status === 204){
        setAlertText("Tarefa atualizada com sucesso.");
        setSeverity("success");
        handleOpen();
        handleClose();
      }
    })
    .catch(error => {
      console.log(error);
      setAlertText("Falha ao deletar tarefa. [ErrorMsg: "+error+"]");
      setSeverity("danger");
      handleOpen();
      handleClose();
    });
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titulo"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            margin="dense"
            label="Status"
          >
            <MenuItem value="ATIVO">ATIVO</MenuItem>
            <MenuItem value="CONCLUIDO">CONCLUIDO</MenuItem>
            <MenuItem value="CANCELADO">CANCELADO</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>Cancel</Button>
          <Button color="success" variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3000} onClose={handleCloseAlert}>
      <Alert
        onClose={handleCloseAlert}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {alertText}
      </Alert>
    </Snackbar>
  </>
  );
};

export default EditModal;
