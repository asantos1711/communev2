import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import TableSkeleton from "../../loaders/TableSkeleton";
import Get from "../../service/Get";
import { I_MORATORIOS_LIST } from "../../service/Routes";
import TableData from "../../components/TableData";

export default function InteresesMoratoriosList({
  auth,
  handleIsEditing,
  path,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  let history = useHistory();

  useEffect(() => {
    DataList();
  }, []);

  const DataList = () => {
    setIsLoading(true);
    Get({ url: I_MORATORIOS_LIST, access_token: auth.data.access_token })
      .then((response) => {
        setItems(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        // console.log('error')
        // console.log(error)
      });
  };
  const actions = (cell, row, rowIndex) => {
    return (
      <div>
        {/* { (IsDirector(auth.data.role) || IsAdministrador(auth.data.role)) &&
                    <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(row)}><RiDeleteBinLine  /></Button>
                } */}
        <Button
          size="sm"
          variant="outline-secondary"
          className="btn-xs"
          onClick={(e) => editItem(row)}
        >
          <FiEdit />
        </Button>
      </div>
    );
  };
  const enabledFormatter = (cell) => {
    if (cell) {
      return <span className="text-success">ACTIVO</span>;
    } else {
      return <span className="text-danger">NO ACTIVO</span>;
    }
  };

  const columns = [
    {
      dataField: "id",
      headerStyle: { width: "0px" },
      text: "ID",
      hidden: true,
    },
    {
      dataField: "lote.referencia",
      text: "Lote",
    },
    {
      dataField: "porcentaje",
      text: "Pocentaje",
    },
    {
      dataField: "activo",
      text: "Activo",
      formatter: enabledFormatter,
    },
    {
      dataField: "",
      isDummyField: true,
      text: "",
      headerAlign: "center",
      align: "center",
      headerStyle: { width: "10%" },
      formatter: actions,
    },
  ];

  const editItem = (row) => {
    handleIsEditing(true);
    history.push(`${path}/value?id=${row.id}`);
  };

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <TableData columns={columns} products={items} />
      )}
    </div>
  );
}
