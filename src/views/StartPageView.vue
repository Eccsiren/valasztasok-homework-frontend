/* eslint-disable @typescript-eslint/no-non-null-assertion */
<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { useReportStore } from "../store/reportStore";
  import TxtWritter from "../components/TxtWriter.vue";

  const reportStore = useReportStore();
  const utcakStat = new Map<string, string>();
  const fizetendoAdo = new Map<number, number>();
  const fizetendoTxt = ref("");
  const newUtcaTxt = ref("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ISav {
    sav: string;
    ado: number;
    hatar: number;
  }

  const { data, isLoading, pagination } = storeToRefs(reportStore);
  let keyword: string;

  // // ha az input adószám megváltozik:
  // watch(data.value, () => {
  //   dataNfiltered.value = dataN.value.filter((x) => x.adoszam == data.value.adoszam);
  // });

  // // ha betöltődnek/változnak az utcák adatai:
  // watch(dataN, () => {
  //   dataNfiltered.value = dataN.value.filter((x) => x.adoszam == data.value.adoszam);
  //   for (const item of dataN.value) {
  //     const aktUtca: string = item.utca as string;
  //     const aktAdosáv: ISav = item.adosav as ISav;
  //     if (!utcakStat.has(aktUtca)) {
  //       utcakStat.set(aktUtca, aktAdosáv.sav);
  //     } else {
  //       if (utcakStat.get(aktUtca)?.indexOf(aktAdosáv.sav) == -1) {
  //         utcakStat.set(aktUtca, utcakStat.get(aktUtca) + aktAdosáv.sav);
  //       }
  //     }
  //   }
  //   // fizetendo.txt állományhoz a fizetendoTxt tartalmának összeállítása
  //   for (const item of dataN.value) {
  //     const aktAdosáv: ISav = item.adosav as ISav;
  //     const adószám: number = item.adoszam as number;
  //     const terület: number = item.terulet as number;
  //     if (!fizetendoAdo.has(adószám)) {
  //       // első ingatlan adója:
  //       fizetendoAdo.set(adószám, ado(aktAdosáv, terület));
  //     } else {
  //       // többi ingatlan adója:
  //       const korábbiIngatlanokAdója: number = fizetendoAdo.get(adószám) as number;
  //       fizetendoAdo.set(adószám, korábbiIngatlanokAdója + ado(aktAdosáv, terület));
  //     }
  //   }
  //   for (const item of fizetendoAdo) {
  //     const adószám: number = item[0]; // key
  //     const összesAdó: number = item[1]; // value
  //     fizetendoTxt.value += `${adószám} ${összesAdó}\r\n`;
  //   }

  //   // Nem a megoldás része:
  //   // Az új utca.txt állományhoz a newUtcaTxt tartalmának összeállítása
  //   // Az első sorban lévő adóösszegek:
  //   const elsoSor: string[] = [];
  //   for (const item of partyStore.dataN.sort((a, b) => (b.ado as number) - (a.ado as number))) {
  //     elsoSor.push(`${item.ado}`);
  //   }
  //   newUtcaTxt.value = elsoSor.join(" ") + "\r\n";

  //   // A 2. sortól az útcák és a házszámok
  //   for (const e of dataN.value.sort((a, b) =>
  //     `${a.utca} ${a.hazszam}`.localeCompare(`${b.utca} ${b.hazszam}`, undefined, {
  //       numeric: true,
  //       sensitivity: "base",
  //     })
  //   )) {
  //     const aktAdosáv: string = (e.adosav as ISav).sav;
  //     newUtcaTxt.value += `${e.adoszam} ${e.utca} ${e.hazszam} ${aktAdosáv} ${e.terulet}\r\n`;
  //   }
  // })

  function toPercent(value?: number): string {
    if (value === undefined) {
      return "0";
    }

    return Number(value * 100).toFixed(2);
  }

  function ratio(value?: number): string {
    if (reportStore.data.all_votes_stat === undefined) {
      return "0";
    } else if (value === undefined || reportStore.data.all_votes_stat[0].sum_val === undefined) {
      return "0";
    }
    return Number((value / reportStore.data.all_votes_stat[0].sum_val) * 100).toFixed(2);
  }

  function search(keyword: string) {
    reportStore.getPaginated({ keyword: keyword });
  }

  onMounted(() => {
    reportStore.getAll();
  });
</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div v-if="reportStore.data" class="col-12 col-sm-8 col-md-6 col-lg-4 q-gutter-md">
        <q-form class="q-gutter-md">
          <h4 class="text-center q-mt-lg q-mb-none">Választások feladat megoldása</h4>
          <p>
            <b>2. feladat.</b>
            A helyhatósági választáson {{ reportStore.data.candidate_count }} képviselőjelölt
            indult.
          </p>
          <p><b>3. feladat.</b></p>
          <q-input
            v-model="keyword"
            filled
            label="Írja be a keresett képviselőjelölt nevét!"
            type="text"
          />
          <p>Keresett jelölt szavazatainak száma: {{ reportStore.data.candidate_num_of_votes }}</p>
          <div class="row justify-center">
            <q-btn class="q-mr-md" color="blue" label="Keresés" no-caps @click="search(keyword)" />
          </div>
          <p v-for="(item, index) in reportStore.data.all_votes_stat" :key="index">
            <b>4. feladat.</b>
            A választáson {{ item.sum_val }} állampolgár, a jogosultak
            {{ toPercent(item.ratio) }}%-a vett részt.
          </p>
          <p><b>5. feladat.</b></p>
          <p v-for="(item, index) in reportStore.data.party_votes_stat" :key="index">
            {{ item.party_name }}= {{ ratio(item.num_of_votes) }}%
          </p>
          <p v-for="(item, index) in reportStore.data.elected_candidate" :key="index">
            <b>6. feladat.</b>
            A legtöbb szavazatot {{ item.name }} {{ item.party?.short_name }}
            kapta.
          </p>
          <p><b>7. feladat.</b></p>
          <p v-for="(item, index) in reportStore.data.constituency_winners" :key="index">
            {{ item.constituency }} {{ item.name }} {{ item.party_short_name }}
          </p>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
