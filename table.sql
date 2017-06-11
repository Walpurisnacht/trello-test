-- Boards master
CREATE TABLE board_master (
  bm_id TEXT PRIMARY KEY,
  org_id TEXT,

  bm_name TEXT,
  bm_close_flg BOOLEAN
);

-- List master
CREATE TABLE list_master (
  lm_id TEXT PRIMARY KEY,
  bm_id TEXT,

  lm_name TEXT,
  lm_close_flg BOOLEAN

--   FOREIGN KEY(bm_id) REFERENCES board_master(bm_id)
);

-- Card master
CREATE TABLE card_master (
  cm_id TEXT PRIMARY KEY,
  bm_id TEXT,
  lm_id TEXT,
  lbm_id TEXT,

  cm_name TEXT,
  cm_close_flg BOOLEAN

--   FOREIGN KEY(bm_id) REFERENCES board_master(bm_id),
--   FOREIGN KEY(lm_id) REFERENCES list_master(lm_id),
--   FOREIGN KEY(lbm_id) REFERENCES label_master(lbm_id)
);

-- Label master
CREATE TABLE label_master (
  lbm_id TEXT PRIMARY KEY,
  bm_id TEXT,

  lbm_color TEXT

--   FOREIGN KEY(bm_id) REFERENCES board_master(bm_id)
);

-- Checklist master
CREATE TABLE chklist_master (
  clm_id TEXT PRIMARY KEY,
  bm_id TEXT,
  cm_id TEXT,

  clm_name TEXT

--   FOREIGN KEY(bm_id) REFERENCES board_master(bm_id),
--   FOREIGN KEY(cm_id) REFERENCES card_master(cm_id)
);

-- Checklist item master
CREATE TABLE chk_item_master (
  cim_id TEXT PRIMARY KEY,
  clm_id TEXT,

  cim_name TEXT,
  cim_state_flg BOOLEAN

--   FOREIGN KEY(clm_id) REFERENCES chklist_master(clm_id)
);