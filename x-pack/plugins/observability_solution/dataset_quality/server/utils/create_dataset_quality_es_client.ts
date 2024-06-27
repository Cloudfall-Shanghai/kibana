/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ESSearchRequest, InferSearchResponseOf } from '@kbn/es-types';
import { ElasticsearchClient } from '@kbn/core/server';
import {
  FieldCapsRequest,
  FieldCapsResponse,
  Indices,
  IndicesGetMappingResponse,
  IndicesGetSettingsResponse,
  IndicesGetDataStreamResponse,
  IndicesGetIndexTemplateResponse,
  ClusterGetComponentTemplateResponse,
} from '@elastic/elasticsearch/lib/api/types';

type DatasetQualityESSearchParams = ESSearchRequest & {
  size: number;
};

export type DatasetQualityESClient = ReturnType<typeof createDatasetQualityESClient>;

export function createDatasetQualityESClient(esClient: ElasticsearchClient) {
  return {
    async search<TDocument, TParams extends DatasetQualityESSearchParams>(
      searchParams: TParams
    ): Promise<InferSearchResponseOf<TDocument, TParams>> {
      return esClient.search<TDocument>(searchParams) as Promise<any>;
    },
    async msearch<TDocument, TParams extends DatasetQualityESSearchParams>(
      index = {} as { index?: Indices },
      searches: TParams[]
    ): Promise<{
      responses: Array<InferSearchResponseOf<TDocument, TParams>>;
    }> {
      return esClient.msearch({
        searches: searches.map((search) => [index, search]).flat(),
      }) as Promise<any>;
    },
    async fieldCaps(params: FieldCapsRequest): Promise<FieldCapsResponse> {
      return esClient.fieldCaps(params) as Promise<any>;
    },
    async mappings(params: { index: string }): Promise<IndicesGetMappingResponse> {
      return esClient.indices.getMapping(params);
    },
    async settings(params: { index: string }): Promise<IndicesGetSettingsResponse> {
      return esClient.indices.getSettings(params);
    },
    async getDataStream(params: { name: string }): Promise<IndicesGetDataStreamResponse> {
      return esClient.indices.getDataStream(params);
    },
    async getIndexTemplate(params: { name: string }): Promise<IndicesGetIndexTemplateResponse> {
      return esClient.indices.getIndexTemplate(params);
    },
    async getComponentTemplate(params: {
      name: string;
    }): Promise<ClusterGetComponentTemplateResponse> {
      return esClient.cluster.getComponentTemplate(params);
    },
  };
}
