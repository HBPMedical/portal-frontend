import {
  TableResult,
  Variable,
} from '../components/API/GraphQL/types.generated';

export interface BoxPlotData {
  variable: string;
  variableLabel: string;
  datasets: {
    name: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    mean: number;
  }[];
}

export interface TableStatistics {
  min?: number;
  max?: number;
  mean?: number;
  q1?: number;
  q2?: number;
  q3?: number;
}

/**
 * Extract box plot data from descriptive statistics table results
 * Only processes tables from the specified group to avoid duplicates
 */
export const extractBoxPlotData = (
  tableResults: TableResult[],
  domain: any,
  groupName?: string
): BoxPlotData[] => {
  const boxPlotData: BoxPlotData[] = [];

  tableResults.forEach((tableResult) => {
    // Skip if no data or headers
    if (
      !tableResult.data ||
      !tableResult.headers ||
      tableResult.data.length === 0
    ) {
      return;
    }

    // Extract variable name from table name (usually the first part)
    // If table name is empty, try to get it from the first row of data
    let variableName = tableResult.name;

    if (!variableName && tableResult.data && tableResult.data.length > 0) {
      // Get variable name from the first row, first column
      variableName = tableResult.data[0][0] || '';
    }
    // Find the variable in domain to check if it's nominal
    const variable = domain?.variables?.find(
      (v: Variable) => v.label === variableName || v.id === variableName
    );

    // Skip nominal variables
    if (variable?.type === 'nominal' || variable?.enumerations?.length) {
      return;
    }

    // Extract dataset names from headers (skip first header which is usually empty or variable name)
    const datasetNames = tableResult.headers
      .slice(1)
      .map((header) => header.name || '');

    // Find statistics rows in the table data
    const statsMap = new Map<string, TableStatistics>();

    tableResult.data.forEach((row) => {
      if (row.length < 2) return;

      const statName = row[0]?.toLowerCase();
      const values = row.slice(1);

      if (!statName) return;

      // Map different possible statistic names
      let mappedStat: keyof TableStatistics | null = null;

      if (statName.includes('min')) mappedStat = 'min';
      else if (statName.includes('max')) mappedStat = 'max';
      else if (statName.includes('mean')) mappedStat = 'mean';
      else if (statName.includes('q1') || statName.includes('25%'))
        mappedStat = 'q1';
      else if (
        statName.includes('q2') ||
        statName.includes('median') ||
        statName.includes('50%')
      )
        mappedStat = 'q2';
      else if (statName.includes('q3') || statName.includes('75%'))
        mappedStat = 'q3';

      if (mappedStat) {
        values.forEach((value, index) => {
          const datasetName = datasetNames[index];
          if (datasetName && value !== '') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              if (!statsMap.has(datasetName)) {
                statsMap.set(datasetName, {});
              }
              const datasetStats = statsMap.get(datasetName)!;
              datasetStats[mappedStat!] = numValue;
            }
          }
        });
      }
    });

    // Convert to BoxPlotData format
    const datasets = Array.from(statsMap.entries()).map(
      ([datasetName, stats]) => ({
        name: datasetName,
        min: stats.min || 0,
        q1: stats.q1 || 0,
        median: stats.q2 || 0,
        q3: stats.q3 || 0,
        max: stats.max || 0,
        mean: stats.mean || 0,
      })
    );

    if (datasets.length > 0) {
      const variableLabel = variable?.label || variableName;

      boxPlotData.push({
        variable: variableName,
        variableLabel: variableLabel,
        datasets,
      });
    }
  });

  return boxPlotData;
};

/**
 * Extract table results from a specific group
 */
export const extractTableResultsFromGroup = (
  groups: any[],
  groupName: string
): TableResult[] => {
  const tableResults: TableResult[] = [];

  console.log('extractTableResultsFromGroup called with groupName:', groupName);
  console.log(
    'Available groups:',
    groups?.map((g: any) => g.name)
  );

  groups?.forEach((group) => {
    console.log('Checking group:', group.name, 'against:', groupName);
    if (group.name === groupName) {
      console.log('Found matching group:', group.name);
      console.log(
        'Group results:',
        group.results?.map((r: any) => r.__typename)
      );

      group.results?.forEach((result: any) => {
        console.log('Checking result:', result.__typename, result.name);
        if (
          result.__typename === 'TableResult' &&
          isDescriptiveStatisticsTable(result as TableResult)
        ) {
          console.log('Adding table result:', result.name);
          tableResults.push(result as TableResult);
        }
      });
    }
  });

  console.log('Final table results count:', tableResults.length);
  return tableResults;
};

/**
 * Filter table results to only include Models table results
 * This helps avoid duplicate box plots from Variables table
 */
export const filterModelsTableResults = (
  tableResults: TableResult[],
  groups: any[]
): TableResult[] => {
  // Get the Models group table results
  const modelsTableResults = extractTableResultsFromGroup(groups, 'Models');

  // Filter the input tableResults to only include those that are in the Models group
  return tableResults.filter((tableResult) =>
    modelsTableResults.some(
      (modelsTable) =>
        modelsTable.name === tableResult.name &&
        modelsTable.data === tableResult.data
    )
  );
};

/**
 * Check if a table result contains descriptive statistics
 */
export const isDescriptiveStatisticsTable = (
  tableResult: TableResult
): boolean => {
  if (!tableResult.data || tableResult.data.length === 0) return false;

  // Check if the table contains typical descriptive statistics
  const firstColumn = tableResult.data.map(
    (row) => row[0]?.toLowerCase() || ''
  );
  const hasStats = firstColumn.some(
    (stat) =>
      stat.includes('min') ||
      stat.includes('max') ||
      stat.includes('mean') ||
      stat.includes('median') ||
      stat.includes('q1') ||
      stat.includes('q3') ||
      stat.includes('std')
  );

  console.log(
    'isDescriptiveStatisticsTable for:',
    tableResult.name,
    'result:',
    hasStats
  );
  console.log('First column values:', firstColumn);

  return hasStats;
};

/**
 * Check if we have any non-nominal variables in the results
 */
export const hasNonNominalVariables = (
  tableResults: TableResult[],
  domain: any
): boolean => {
  return tableResults.some((tableResult) => {
    const variableName = tableResult.name;
    const variable = domain?.variables?.find(
      (v: Variable) => v.label === variableName || v.id === variableName
    );

    return !(variable?.type === 'nominal' || variable?.enumerations?.length);
  });
};
