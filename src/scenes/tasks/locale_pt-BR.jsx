const locale_ptBR = {
  // Toolbar
  toolbarDensity: 'Densidade',
  toolbarDensityLabel: 'Densidade',
  toolbarDensityCompact: 'Compacto',
  toolbarDensityStandard: 'Padrão',
  toolbarDensityComfortable: 'Confortável',
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarFiltersTooltipHide: 'Esconder filtros',
  toolbarFiltersTooltipShow: 'Mostrar filtros',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros ativos` : `${count} filtro ativo`,
  toolbarLabel: 'Ferramentas',
  toolbarColumns: 'Colunas',
  toolbarColumnsLabel: 'Selecione colunas',
  toolbarColumnsTooltipHide: 'Esconder colunas',
  toolbarColumnsTooltipShow: 'Mostrar colunas',
  toolbarColumnsTooltipActive: (count) =>
    count !== 1 ? `${count} colunas ativas` : `${count} coluna ativa`,
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Download CSV',

  // Pagination
  paginationRowsPerPage: 'Linhas por página:',
  paginationOf: 'de',

  // Empty Rows
  noRowsLabel: 'Nenhum registro encontrado',

  // Columns Selector
  columnsSelectorPlaceholder: 'Selecione colunas',

  // Column Menu
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Mostrar colunas',
  columnMenuFilter: 'Filtrar',
  columnMenuHideColumn: 'Esconder coluna',
  columnMenuUnsort: 'Remover ordenação',
  columnMenuSortAsc: 'Ordenar ascendente',
  columnMenuSortDesc: 'Ordenar descendente',

  // Filter Panel
  filterPanelAddFilter: 'Adicionar filtro',
  filterPanelDeleteIconLabel: 'Apagar',
  filterPanelOperators: 'Operadores',
  filterPanelOperatorAnd: 'E',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colunas',
};

export default locale_ptBR;