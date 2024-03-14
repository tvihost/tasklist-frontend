import { useEffect, useState, Fragment } from "react";
import { Box, IconButton, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from '@mui/icons-material/Edit';
import Delete from "@mui/icons-material/Delete";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditModal from "../../components/EditModal";
import axios from 'axios';
import locale_ptBR from "./locale_pt-BR";

const Tasks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tasksList, setTasksList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("danger");  
  const [alertText, setAlertText] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [key, setKey] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  const [openDialogEraseFinishedTasks, setOpenDialogEraseFinishedTasks] = useState(false);

  const handleConfirmEraseFinishedTasks = () => {
    deleteAllFinishedTasks()
    setOpenDialogEraseFinishedTasks(false);
  };

  const handleOpenDialogEraseFinishedTasks = () => {
    setOpenDialogEraseFinishedTasks(true);
  };

  const handleCloseDialogEraseFinishedTasks = () => {
    setOpenDialogEraseFinishedTasks(false);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);

    const filteredData = tasksList.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilteredRows(filteredData);
  };

  async function deleteAllFinishedTasks(){
    await axios.post('http://localhost:3000/tasks/delete', {"status":"CONCLUIDO"}, { withCredentials: true })
    .then(response => {
      if(response.status === 204){
        setAlertText("Tarefas concluídas deletadas com sucesso.");
        setSeverity("success");
        handleOpen();
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  async function getTasks(){
    await axios.get('http://localhost:3000/tasks', { withCredentials: true })
    .then(response => {
      if(response.status === 200){
        setTasksList(response.data.tasks);
        setFilteredRows(response.data.tasks);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  async function deleteTask(id){
    await axios.delete('http://localhost:3000/tasks/'+id, { withCredentials: true })
    .then(response => {
      if(response.status === 204){
        setAlertText("Tarefa deletada com sucesso.");
        setSeverity("success");
        handleOpen();
      }
    })
    .catch(error => {
      console.log(error);
      setAlertText("Falha ao deletar tarefa. [ErrorMsg: "+error+"]");
      setSeverity("danger");
      handleOpen();
    });
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    if(severity === "success")
    {
      window.location.reload();
    }

    setOpen(false);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setKey(prevKey => prevKey + 1);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Handle delete action
    console.log('Delete row:', selectedId);
    deleteTask(selectedId);
    setDeleteOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "title",
      headerName: "Titulo",
      flex: 1,
      cellClassName: "name-column--cell",
      autoWidth: true
    },
    {
      field: "description",
      headerName: "Descrição",
      flex: 1,
      cellClassName: "name-column--cell",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status = params.value;
        let cellStyle = status === "CONCLUIDO" ? { backgroundColor: 'green', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', width:'60%', padding:'2px' } : status === 'ATIVO' ? { backgroundColor: 'blue', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', width:'60%', padding:'2px' } : { backgroundColor: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', width:'60%', padding:'2px' };

        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "created_at",
      headerName: "Criado em",
      flex: 1,
      width: 50,
      valueFormatter: (params) => {
        // Parse the date string to a Date object
        const date = new Date(params.value);
        // Format the date to your desired format (e.g., MM/DD/YYYY)
        return date.toLocaleDateString('pt-BR');
      }
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            color="secondary"
            aria-label="edit"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            aria-label="delete"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleDeleteAllFinishedTasks = () => {
    
  };

  const ConfirmDialogDeleteFinishedTasks = ({ open, onClose, onConfirm }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente limpar todas as tarefas concluídas?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const DeleteToolbar = () => {
    return (
      <div>
        <Button color="inherit" variant="text" onClick={handleOpenDialogEraseFinishedTasks}>
          <DeleteIcon />
          Limpar Concluídos
        </Button>
      </div>
    );
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <DeleteToolbar />
      </GridToolbarContainer>
    );
  }

  return (
    <Box m="20px">
      <Header
        title="Tarefas"
        subtitle="Lista de Tarefas"
      />
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Pesquisar..." value={searchText} onChange={handleSearch} />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box
        m="40px 0 0 0"
        height="55vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          components={{ Toolbar: CustomToolbar}}
          localeText={locale_ptBR}
        />
      </Box>
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirma?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja deletar esta linha?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleDeleteCancel}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm} autoFocus>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
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
      <EditModal key={key} open={editOpen} handleClose={handleEditClose} rowData={selectedRow} />
      <ConfirmDialogDeleteFinishedTasks 
        open={openDialogEraseFinishedTasks} 
        onClose={handleCloseDialogEraseFinishedTasks} 
        onConfirm={handleConfirmEraseFinishedTasks} 
      />
    </Box>
  );
};

export default Tasks;
