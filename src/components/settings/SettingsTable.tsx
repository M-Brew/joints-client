"use client";

import { useEffect, useState, MouseEvent } from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Container from "@mui/material/Container";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

import navItems from "@/data/settings-data.json";
import SettingsForm from "./SettingsForm";
import SettingsDrawer from "./SettingsDrawer";
import SettingsDetail from "./SettingsDetail";
import {
  addSettingItem,
  deleteSettingItem,
  getSettingItems,
  updateSettingItem,
} from "@/app/api/settings";

export default function SettingsTable(props: {
  slug: string;
  data?: ISettingItem[];
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const [slug, setSlug] = useState("");
  const [data, setData] = useState<ISettingItem[]>([]);
  const [title, setTitle] = useState<string>();
  const [openForm, setOpenForm] = useState(false);
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();
  const [selectedItem, setSelectedItem] = useState<ISettingItem>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    const item = navItems.find((i) => i.slug === props.slug);
    setTitle(item?.title);
    setSlug(props.slug);

    (async () => {
      try {
        const response = await getSettingItems(props.slug);
        if (response?.status === 200) {
          setData(response.data ?? []);
        }
      } catch (error) {
        console.log({ error });
      }
    })();
  }, [props.slug]);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setError(undefined);
    setOpenForm(false);
  };

  const handleOpenDetails = (settingItem: ISettingItem) => {
    setSelectedItem(settingItem);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedItem(undefined);
    setOpenDetails(false);
  };

  const handleOpenDrawer = (value: boolean) => {
    setOpenDrawer(value);
  };

  const handleAdd = async (name: string, description: string) => {
    try {
      setError(undefined);

      const response = await addSettingItem(slug, { name, description });
      if (response?.status === 201) {
        const responseData = response.data;
        setData((prev) => [...prev, responseData as ISettingItem]);
        setSuccess(
          `${title?.slice(0, title.length - 1)} created successfully.`
        );
        setTimeout(() => {
          setSuccess(undefined);
          handleCloseForm();
        }, 2000);
      } else {
        const error = response?.data;
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

  const handleUpdate = async (name: string, description: string) => {
    try {
      setError(undefined);

      const response = await updateSettingItem(slug, selectedItem?._id!, { name, description });
      if (response?.status === 200) {
        const update = data.map((i) =>
          i._id === (response.data as ISettingItem)._id ? response.data : i
        );
        setData(update);
        setSuccess(
          `${title?.slice(0, title.length - 1)} updated successfully.`
        );
        setTimeout(() => {
          setSuccess(undefined);
          handleCloseForm();
        }, 2000);
      } else {
        const error = response?.data;
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
    item: ISettingItem;
    handleClose: () => void;
    handleDeleteError: (error?: string) => void;
  }) => {
    const { item, handleClose, handleDeleteError } = props;
    try {
      handleDeleteError(undefined);

      const response = await deleteSettingItem(slug, item._id);
      if (response?.status === 204) {
        setSuccess(
          `${title?.slice(0, title.length - 1)} deleted successfully.`
        );
        setTimeout(() => {
          const update = data.filter((i) => i._id !== item._id);
          setData(update);
          setSuccess(undefined);
          handleClose();
        }, 2000);
      } else {
        const error = response?.data;
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
          <Box display="flex">
            {!matches && (
              <MenuIcon
                sx={{ mr: 2, cursor: "pointer" }}
                onClick={() => handleOpenDrawer(true)}
              />
            )}
            <Typography fontSize={18}>{title ?? ""}</Typography>
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
                  <TableCell align="right">Count</TableCell>
                  {matches && (
                    <>
                      <TableCell align="right">Created At</TableCell>
                      <TableCell align="right">Last Updated</TableCell>
                    </>
                  )}
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
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => handleOpenDetails(item)}
                    >
                      <Box>
                        <Box>
                          <Typography>{item.name}</Typography>
                        </Box>
                        <Box>
                          <Typography
                            fontSize={14}
                            sx={{
                              opacity: 0.5,
                              whiteSpace: "nowrap",
                              maxWidth: "180px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() => handleOpenDetails(item)}
                    >
                      {item.count}
                    </TableCell>
                    {matches && (
                      <>
                        <TableCell
                          align="right"
                          onClick={() => handleOpenDetails(item)}
                        >
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-uk",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => handleOpenDetails(item)}
                        >
                          {new Date(item.updatedAt).toLocaleDateString(
                            "en-uk",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </TableCell>
                      </>
                    )}
                    <TableCell align="right">
                      <RowMenu
                        rowItem={item}
                        success={success}
                        handleDelete={handleDelete}
                        handleOpenEdit={() => {
                          handleOpenForm();
                          setSelectedItem(item);
                        }}
                      />
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
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: matches ? 700 : "80%",
            bgcolor: "background.paper",
            borderRadius: "5px",
            p: matches ? 4 : 2,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={18}>
              {selectedItem ? "Update" : "Add"}{" "}
              {title?.slice(0, title.length - 1)}
            </Typography>
            <CloseIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={handleCloseForm}
            />
          </Box>
          <SettingsForm
            item={selectedItem}
            handleSubmit={selectedItem ? handleUpdate : handleAdd}
          />
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
      <Modal open={openDetails} onClose={handleCloseDetails}>
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: matches ? 600 : "80%",
            bgcolor: "background.paper",
            borderRadius: "5px",
            p: matches ? 4 : 2,
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <CloseIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={handleCloseDetails}
            />
          </Box>
          <SettingsDetail settingItem={selectedItem} />
        </Box>
      </Modal>
      <SettingsDrawer
        slug={slug}
        open={openDrawer}
        handleOpenDrawer={handleOpenDrawer}
      />
    </>
  );
}

const RowMenu = (props: IRowMenu) => {
  const { rowItem, success, handleOpenEdit, handleDelete } = props;

  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const open = Boolean(anchorEl);

  const [openDelete, setOpenDelete] = useState(false);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
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
            handleOpenEdit();
            handleClose();
          }}
        >
          <Typography fontSize={14}>Edit</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDelete(true);
            handleClose();
          }}
        >
          <Typography fontSize={14}>Delete</Typography>
        </MenuItem>
      </Menu>
      <DeleteSettingDialog
        open={openDelete}
        item={rowItem}
        success={success}
        handleClose={() => setOpenDelete(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
};

const DeleteSettingDialog = (props: IDeleteSettingDialog) => {
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
  rowItem: ISettingItem;
  success?: string;
  handleOpenEdit: () => void;
  handleDelete: (props: {
    item: ISettingItem;
    handleClose: () => void;
    handleDeleteError: (error?: string) => void;
  }) => void;
}

interface IDeleteSettingDialog {
  open: boolean;
  item: ISettingItem;
  success?: string;
  handleClose: () => void;
  handleDelete: (props: {
    item: ISettingItem;
    handleClose: () => void;
    handleDeleteError: (error?: string) => void;
  }) => void;
}
