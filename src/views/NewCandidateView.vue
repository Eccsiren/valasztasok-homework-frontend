<script setup lang="ts">
  import { useCandidatesStore } from "../store/candidatesStore";
  import { usePartiesStore } from "../store/partiesStore";
  import router from "src/router";

  const candidateStore = useCandidatesStore();
  const partyStore = usePartiesStore();

  onMounted(() => {
    partyStore.getAll();
  });

  function Submit() {
    candidateStore.create();
  }

  function Reset() {
    router.push("/qtableCandidate");
  }
</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div v-if="candidateStore.data" class="col-12 col-sm-8 col-md-6 col-lg-4 q-gutter-md">
        <q-form class="q-gutter-md" @reset="Reset()" @submit="Submit">
          <h4 class="text-center q-mt-lg q-mb-none">New record</h4>
          <q-input v-model.number="candidateStore.data._id" filled label="_id:" type="number" />
          <q-select
            v-model.number="candidateStore.data.party"
            clearable
            emit-value
            filled
            label="Párt:"
            map-options
            option-label="short_name"
            option-value="_id"
            :options="partyStore.dataN.sort((a, b) => a.short_name!.localeCompare(b.short_name!))"
          />
          <q-input v-model.number="candidateStore.data.name" filled label="Név:" type="text" />
          <q-input
            v-model="candidateStore.data.constituency"
            filled
            label="Választókerület:"
            type="number"
          />
          <q-input
            v-model="candidateStore.data.number_of_votes"
            filled
            label="Szavazatok száma:"
            type="number"
          />
          <div class="row justify-center">
            <q-btn class="q-mr-md" color="green" label="Mentés" no-caps type="submit" />
            <q-btn class="q-mr-md" color="red" label="Mégsem" no-caps type="reset" />
          </div>
          <p>Actual: {{ candidateStore.data }}</p>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
