"use client";

import { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import JointForm from "./JointForm";
import { addJoint, deleteJoint, getJoints } from "@/app/api/joints";

export default function JointsTable() {
  const [data, setData] = useState<IJoint[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const router = useRouter();

  const handleGetJoints = async () => {
    try {
      const response = await getJoints();
      if (response?.status === 200) {
        setData(response.data ?? []);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    handleGetJoints();
  }, []);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setError(undefined);
    setOpenForm(false);
  };

  const handleOpenDetails = (slug: string) => {
    router.push(`/admin/dashboard/joints/${slug}`);
  };

  const handleAdd = async (payload: IJointFormValues) => {
    try {
      setError(undefined);

      const response = await addJoint(payload);
      if (response?.status === 201) {
        await handleGetJoints();
        setSuccess(`New joint created successfully.`);
        setTimeout(() => {
          setSuccess(undefined);
          handleCloseForm();
        }, 2000);
      } else {
        const error = await response?.data;
        if (error) {
          setError(error.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleDelete = async (props: {
    item: IJoint;
    handleClose: () => void;
    handleDeleteError: (error?: string) => void;
  }) => {
    const { item, handleClose, handleDeleteError } = props;
    try {
      handleDeleteError(undefined);

      const response = await deleteJoint(item._id);
      if (response?.status === 204) {
        setSuccess(`${item.name} deleted successfully.`);
        setTimeout(() => {
          const update = data.filter((i) => i._id !== item._id);
          setData(update);
          setSuccess(undefined);
          handleClose();
        }, 2000);
      } else {
        const error = await response?.data();
        if (error) {
          handleDeleteError(error.error);
        } else {
          handleDeleteError("An error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.log(error);
      handleDeleteError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <Box>
        <Box
          padding={2}
          display="flex"
          justifyContent="space-between"
          sx={{ borderBottom: "0.5px solid black" }}
        >
          <Box display="flex-end">
            <Typography fontSize={18}>Joints</Typography>
          </Box>
          <Button variant="contained" size="small" onClick={handleOpenForm}>
            <Typography>Add</Typography>
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: "77vh" }}>
          {data.length > 0 ? (
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="center">Created At</TableCell>
                  <TableCell align="center">Verified</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    hover
                  >
                    <TableCell onClick={() => handleOpenDetails(item.slug)}>
                      <Typography>{item.name}</Typography>
                    </TableCell>
                    <TableCell onClick={() => handleOpenDetails(item.slug)}>
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          maxWidth: "250px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.type.map((t) => (
                          <Chip
                            key={t._id}
                            label={
                              <Typography fontSize={14}>{t.name}</Typography>
                            }
                            sx={{ mr: 1 }}
                          />
                        ))}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => handleOpenDetails(item.slug)}
                    >
                      <Typography>
                        {new Date(item.createdAt).toLocaleDateString("en-uk", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => handleOpenDetails(item.slug)}
                    >
                      {item.verified ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="disabled" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <RowMenu rowItem={item} handleDelete={handleDelete} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Box
              sx={{
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ opacity: 0.5 }}>No data available</Typography>
              </Box>
            </Box>
          )}
        </TableContainer>
      </Box>
      <Modal open={openForm} onClose={handleCloseForm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxHeight: "90%",
            width: matches ? 700 : "80%",
            overflow: "scroll",
            bgcolor: "background.paper",
            borderRadius: "5px",
            p: matches ? 4 : 2,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={18}>Add New Joint</Typography>
            <CloseIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={handleCloseForm}
            />
          </Box>
          <JointForm handleSubmit={handleAdd} />
          {success && (
            <Alert severity="success" icon={false}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" icon={false}>
              {error}
            </Alert>
          )}
        </Box>
      </Modal>
    </>
  );
}

const RowMenu = (props: IRowMenu) => {
  const { rowItem, success, handleDelete } = props;

  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const open = Boolean(anchorEl);

  const [openDelete, setOpenDelete] = useState(false);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <MoreVertIcon
        sx={{ cursor: "pointer" }}
        onClick={(e) => handleClick(e)}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            setOpenDelete(true);
            handleClose();
          }}
        >
          <Typography fontSize={14}>Delete</Typography>
        </MenuItem>
      </Menu>
      <DeleteJointDialog
        open={openDelete}
        item={rowItem}
        success={success}
        handleClose={() => setOpenDelete(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
};

const DeleteJointDialog = (props: IDeleteJointDialog) => {
  const { open, item, success, handleClose, handleDelete } = props;

  const [deleteError, setDeleteError] = useState<string>();

  const handleDeleteError = (error?: string) => {
    setDeleteError(error);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle id="alert-dialog-title">
        <Typography fontSize={18}>
          Are you sure you want to delete {item?.name}?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action is irreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ mr: 2, mb: 2 }}>
        <Button onClick={handleClose} variant="outlined" size="small">
          Cancel
        </Button>
        <Button
          onClick={() => handleDelete({ item, handleClose, handleDeleteError })}
          variant="contained"
          size="small"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
      <Container>
        {success && (
          <Alert severity="success" icon={false} sx={{ my: 2 }}>
            {success}
          </Alert>
        )}
        {deleteError && (
          <Alert severity="error" icon={false} sx={{ my: 2 }}>
            {deleteError}
          </Alert>
        )}
      </Container>
    </Dialog>
  );
};

interface IRowMenu {
  rowItem: IJoint;
  success?: string;
  handleDelete: (props: {
    item: IJoint;
    handleClose: () => void;
    handleDeleteError: (error?: string) => void;
  }) => void;
}

interface IDeleteJointDialog {
  open: boolean;
  item: IJoint;
  success?: string;
  handleClose: () => void;
  handleDelete: (props: {
    item: IJoint;
    handleClose: () => void;
    handleDeleteError: (error?: string) => void;
  }) => void;
}
