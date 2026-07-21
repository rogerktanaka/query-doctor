SELECT *
  FROM item_master im,
       item_loc_soh ils
 WHERE im.item = ils.item
   AND UPPER(im.status) = 'A'
   AND TO_CHAR(ils.last_update_datetime, 'YYYY-MM-DD') >= '2026-01-01'
   AND NVL(ils.stock_on_hand, 0) > 0
   AND ils.loc IN (
       SELECT il.loc
         FROM item_loc il
        WHERE il.status = 'A'
   )
   AND (
       SELECT COUNT(*)
         FROM tran_data_history tdh
        WHERE tdh.item = im.item
          AND tdh.location = ils.loc
   ) > 0
   AND im.item NOT IN (
       SELECT item
         FROM item_supp_country
        WHERE primary_supp = 'N'
   )
 ORDER BY im.item;