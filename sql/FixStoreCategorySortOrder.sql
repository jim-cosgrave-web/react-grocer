WITH CTE_Updates AS (
  SELECT
    StoreCategoryId,
    SortOrder,
    ROW_NUMBER() OVER (
      ORDER BY
        SortOrder
    ) AS CorrectSortOrder
  FROM StoreCategory
  WHERE
    StoreId = 1
)
UPDATE StoreCategory
SET
  SortOrder = u.CorrectSortOrder
FROM StoreCategory sc
INNER JOIN CTE_Updates u ON sc.StoreCategoryId = u.StoreCategoryId