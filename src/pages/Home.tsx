// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { RewardCard } from "../components";
import type { Scenario, Character, Item, ItemPoolEntry } from "../types";
import {
  ref,
  push,
  get,
  update,
  onValue,
  runTransaction,
} from "firebase/database";
import { db } from "../firebase";
import { items, positionOptions, scenarios, mapOptions } from "../data"; // สมมติคุณมีไฟล์ data.ts เก็บ scenarios
import "./Home.css";
import "../App.css";

const Home: React.FC = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [mapArea, setMapArea] = useState("");
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [foundItem, setFoundItem] = useState<Item | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [rollCounts, setRollCounts] = useState<Record<string, number>>({});
  const [showRerollLimitModal, setShowRerollLimitModal] = useState(false);
  const [itemPool, setItemPool] = useState<Record<string, ItemPoolEntry>>({});
  const [showEmptyPoolModal, setShowEmptyPoolModal] = useState(false);

  useEffect(() => {
    const poolRef = ref(db, "itemPool");
    return onValue(poolRef, (snap) => {
      setItemPool((snap.val() as Record<string, ItemPoolEntry> | null) ?? {});
    });
  }, []);

  const pickWeightedItem = (mapAreaId: string): Item | null => {
    const candidates = items
      .filter((it) => it.mapArea === mapAreaId)
      .map((it) => ({ item: it, qty: itemPool[it.id]?.quantity ?? 0 }))
      .filter((c) => c.qty > 0);
    const totalWeight = candidates.reduce((sum, c) => sum + c.qty, 0);
    if (totalWeight <= 0) return null;
    let r = Math.random() * totalWeight;
    for (const c of candidates) {
      r -= c.qty;
      if (r < 0) return c.item;
    }
    return candidates[candidates.length - 1].item;
  };

  const handleSubmit = () => {
    if (!name || !position || !mapArea) {
      const newErrors = {
        name: !name.trim(),
        position: !position,
        mapArea: !mapArea,
      };

      setErrors(newErrors);

      return;
    } else setErrors({ name: false, position: false, mapArea: false });

    const sessionKey = `${name}|${position}|${mapArea}`;
    if ((rollCounts[sessionKey] ?? 0) >= 3) {
      setShowRerollLimitModal(true);
      return;
    }

    const dropItem = pickWeightedItem(mapArea);
    if (!dropItem) {
      setShowEmptyPoolModal(true);
      return;
    }

    setRollCounts((prev) => ({
      ...prev,
      [sessionKey]: (prev[sessionKey] ?? 0) + 1,
    }));

    const randomScenario =
      scenarios[Math.floor(Math.random() * scenarios.length)];
    setCurrentScenario(randomScenario);
    setFoundItem(dropItem);
  };

  const [errors, setErrors] = useState({
    name: false,
    position: false,
    mapArea: false,
  });

  const renderSuccessAlert = (message: string) => {
    return <Alert severity="success">{message}</Alert>;
  };

  const renderErrorAlert = (message: string) => {
    return <Alert severity="error">{message}</Alert>;
  };

  const resetForm = () => {
    setName("");
    setPosition("");
    setMapArea("");
    setCurrentScenario(null);
    setFoundItem(null);
    setErrors({ name: false, position: false, mapArea: false });
  };

  const handleConfirm = async () => {
    if (!foundItem) return;
    try {
      const poolEntryRef = ref(db, `itemPool/${foundItem.id}/quantity`);
      const txn = await runTransaction(poolEntryRef, (current) => {
        const qty = typeof current === "number" ? current : 0;
        if (qty <= 0) return; // abort: nothing left to give
        return qty - 1;
      });
      if (!txn.committed) {
        setShowEmptyPoolModal(true);
        setFoundItem(null);
        setCurrentScenario(null);
        return;
      }

      const snapshot = await get(ref(db, "characters"));
      const raw = snapshot.val() as Record<string, unknown> | null;

      if (raw) {
        const entries = Object.entries(raw);
        for (const [id, data] of entries) {
          const char = data as Partial<Character> & {
            itemsCollected?: unknown;
          };
          if (
            char.name !== name ||
            char.position !== position ||
            char.mapArea !== mapArea
          )
            continue;

          const itemsRaw = char.itemsCollected;
          const existingItems: Item[] = Array.isArray(itemsRaw)
            ? (itemsRaw as Item[])
            : itemsRaw && typeof itemsRaw === "object"
              ? (Object.values(itemsRaw as Record<string, unknown>) as Item[])
              : [];

          if (existingItems.length >= 2) {
            setShowLimitModal(true);
            return;
          }

          const updatedItems = [
            ...existingItems,
            ...(foundItem ? [foundItem] : []),
          ];
          await update(ref(db, `characters/${id}`), {
            itemsCollected: updatedItems,
          });
          alert("บันทึกเรียบร้อย!");
          resetForm();
          return;
        }
      }

      // No existing character with same name + mapArea — create new
      const newChar: Character = {
        name,
        position,
        mapArea,
        itemsCollected: [...(foundItem ? [foundItem] : [])],
      };
      await push(ref(db, "characters"), newChar);
      renderSuccessAlert("บันทึกเรียบร้อย!");
      resetForm();
    } catch (error) {
      console.error("Save failed:", error);
      renderErrorAlert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };
  return (
    <Container className="container">
      <section className="titleSection">
        <Typography variant="h4" className="prompt-regular">
          สุ่มสถานการณ์ในการค้นพาเด็กหญิง Part 2
        </Typography>
        <Typography variant="body1" className="prompt-regular" gutterBottom>
          กรอกข้อมูลตัวละครของคุณและกด "สุ่มสถานการณ์" โดยมีเงื่อนไขดังนี้:
        </Typography>
        <Typography
          variant="body1"
          className="prompt-regular"
          gutterBottom
          sx={{
            textAlign: "left",
          }}
        >
          1. หนึ่งตัวละครสามารถสำรวจได้เพียง 2 ครั้งต่อหนึ่งพื้นที่
        </Typography>
        <Typography
          variant="body1"
          className="prompt-regular"
          gutterBottom
          sx={{
            textAlign: "left",
          }}
        >
          2. การสำรวจแต่ละครั้งสามารถได้รับไอเทมได้เพียงหนึ่งชิ้นเท่านั้น
          (มีโอกาสได้รับไอเทมเดิมซ้ำได้)
        </Typography>
        <Typography
          variant="body1"
          className="prompt-regular"
          gutterBottom
          sx={{
            textAlign: "left",
          }}
        >
          3. การสำรวจแต่ละครั้งสามารถสำรวจซ้ำ้ได้มากสุด 3 ครั้ง
          และครั้งสุดท้ายคุณจะได้รับไอเทมสิ่งนั้นโดยอัตโนมัติ
        </Typography>
      </section>

      <Paper sx={{ p: 2, mb: 3, width: { xs: "100%", sm: "80%" } }}>
        <div className="infoSection">
          <Typography variant="body1" className="prompt-regular" gutterBottom>
            กรอกข้อมูลตัวละครของคุณ
          </Typography>
        </div>

        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              required
              label="ชื่อ-นามสกุลตัวละคร"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              helperText={errors.name ? "กรุณากรอกชื่อ" : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required error={errors.position}>
              <InputLabel>ตำแหน่ง</InputLabel>
              <Select
                label="ตำแหน่ง"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                {positionOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required error={errors.mapArea}>
              <InputLabel>พื้นที่</InputLabel>
              <Select
                label="พื้นที่"
                value={mapArea}
                onChange={(e) => setMapArea(e.target.value)}
              >
                {mapOptions.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name} - {area.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {!(
        name &&
        position &&
        mapArea &&
        (rollCounts[`${name}|${position}|${mapArea}`] ?? 0) >= 3
      ) && (
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          sx={{
            width: { xs: "100%", sm: "auto" },
            height: { xs: "50px", sm: "auto" },
          }}
        >
          สุ่มสถานการณ์
        </Button>
      )}
      {name && position && mapArea && (
        <Typography variant="caption" sx={{ mt: 0.5, display: "block" }}>
          เหลือสุ่มได้อีก{" "}
          {Math.max(0, 3 - (rollCounts[`${name}|${position}|${mapArea}`] ?? 0))}{" "}
          ครั้ง
        </Typography>
      )}

      <Dialog
        open={showRerollLimitModal}
        onClose={() => setShowRerollLimitModal(false)}
      >
        <DialogTitle sx={{ color: "error.main" }}>
          ไม่สามารถสุ่มได้อีกแล้ว
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ตัวละครนี้ใช้สิทธิ์สุ่มครบ 3 ครั้งแล้วในเซสชันนี้
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowRerollLimitModal(false)}
            variant="contained"
          >
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showEmptyPoolModal}
        onClose={() => setShowEmptyPoolModal(false)}
      >
        <DialogTitle sx={{ color: "error.main" }}>
          ไอเทมในพื้นที่นี้หมดแล้ว
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ไอเทมที่สามารถสุ่มได้ในพื้นที่นี้ถูกเก็บไปหมดแล้ว
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowEmptyPoolModal(false)}
            variant="contained"
          >
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showLimitModal} onClose={() => setShowLimitModal(false)}>
        <DialogTitle sx={{ color: "error.main" }}>
          ไม่สามารถเพิ่มไอเทมได้
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ตัวละครนี้มีไอเทมครบ 2 ชิ้นในพื้นที่นี้แล้ว
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLimitModal(false)} variant="contained">
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>

      {currentScenario && foundItem && (
        <RewardCard
          scenario={currentScenario} // คุณอาจต้องปรับโครงสร้าง Scenario ใน data.ts เพื่อให้มี reward
          rewardItem={foundItem} // คุณอาจต้องปรับโครงสร้าง Scenario ใน data.ts เพื่อให้มี reward
          mapName={
            mapOptions.find((m) => m.id === mapArea)?.description ||
            "Unknown Map"
          }
          onRefresh={
            (rollCounts[`${name}|${position}|${mapArea}`] ?? 0) < 3
              ? handleSubmit
              : undefined
          }
          onConfirm={handleConfirm}
        />
      )}
    </Container>
  );
};

export default Home;
