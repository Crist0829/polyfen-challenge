import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProspectsJobTypes, ProspectsJobTypesDocument } from './schemas/prospects-job-types.schema';
import { ProspectsIndustryTypes, ProspectsIndustryTypesDocument } from './schemas/prospects-industry-types.schema';
import { Prospects, ProspectsDocument } from './schemas/prospects.schema';
import { createReadStream } from 'fs';
import * as fastCsv from 'fast-csv';

@Injectable()
export class ProspectsService {
  constructor(
    @InjectModel(ProspectsJobTypes.name) private jobTypesModel: Model<ProspectsJobTypesDocument>,
    @InjectModel(ProspectsIndustryTypes.name) private industryTypesModel: Model<ProspectsIndustryTypesDocument>,
    @InjectModel(Prospects.name) private prospectsModel: Model<ProspectsDocument>,
  ) {}

  async getProspects(): Promise<Prospects[]> {
    return this.prospectsModel
      .find()
      .populate('jobTitle', 'name score')
      .populate('industry', 'name score')
      .exec();
  }

  async processCSV(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const jobTypesSet = new Set<string>();
      const industryTypesSet = new Set<string>();
      const prospects = [];

      const stream = createReadStream(filePath)
        .pipe(fastCsv.parse({ headers: true }))
        .on('data', async (row) => {
          const isRowValid =
            row.name &&
            row.email &&
            row.country &&
            row.jobTitle &&
            row.industry &&
            row.yearsOfExperience &&
            row.companySize &&
            !isNaN(parseInt(row.yearsOfExperience, 10)) &&
            !isNaN(parseInt(row.companySize, 10));

          if (!isRowValid) {
            console.warn(`Invalid row skipped: ${JSON.stringify(row)}`);
            return;
          }

          jobTypesSet.add(row.jobTitle);
          industryTypesSet.add(row.industry);

          prospects.push({
            name: row.name,
            email: row.email,
            country: row.country,
            jobTitle: row.jobTitle,
            industry: row.industry,
            yearsOfExperience: parseInt(row.yearsOfExperience, 10),
            companySize: parseInt(row.companySize, 10),
          });
        })
        .on('end', async () => {
          try {
            const jobTypeDocuments = await this.insertUniqueJobTypes([...jobTypesSet]);
            const industryTypeDocuments = await this.insertUniqueIndustryTypes([...industryTypesSet]);

            await this.insertProspects(prospects, jobTypeDocuments, industryTypeDocuments);

            resolve('CSV processed and data stored successfully');
          } catch (error) {
            reject(`Error processing CSV: ${error.message}`);
          }
        })
        .on('error', (error) => reject(`Error reading CSV: ${error.message}`));
    });
  }

  private async insertUniqueJobTypes(jobTitles: string[]): Promise<Map<string, string>> {
    const jobTypeMap = new Map<string, string>();

    for (const title of jobTitles) {
      const existingJobType = await this.jobTypesModel.findOne({ name: title }).exec();

      if (!existingJobType) {
        const randomScore = this.getRandomScore();
        const newJobType = await this.jobTypesModel.create({ name: title, score: randomScore });
        jobTypeMap.set(title, newJobType._id.toString());
      } else {
        jobTypeMap.set(title, existingJobType._id.toString());
      }
    }

    return jobTypeMap;
  }

  private async insertUniqueIndustryTypes(industryNames: string[]): Promise<Map<string, string>> {
    const industryTypeMap = new Map<string, string>();

    for (const name of industryNames) {
      const existingIndustryType = await this.industryTypesModel.findOne({ name }).exec();

      if (!existingIndustryType) {
        const randomScore = this.getRandomScore();
        const newIndustryType = await this.industryTypesModel.create({ name, score: randomScore });
        industryTypeMap.set(name, newIndustryType._id.toString());
      } else {
        industryTypeMap.set(name, existingIndustryType._id.toString());
      }
    }

    return industryTypeMap;
  }

  private async insertProspects(
    prospects: any[],
    jobTypeDocuments: Map<string, string>,
    industryTypeDocuments: Map<string, string>,
  ): Promise<void> {
    const prospectRecords = await Promise.all(
      prospects.map(async (prospect) => {
        try {
          const jobType = await this.jobTypesModel.findById(jobTypeDocuments.get(prospect.jobTitle)).exec();
          const industryType = await this.industryTypesModel.findById(industryTypeDocuments.get(prospect.industry)).exec();

          const prospectScore = this.calculateProspectScore(
            prospect.yearsOfExperience,
            prospect.companySize,
            jobType.score,
            industryType.score,
          );

          return {
            ...prospect,
            jobTitle: jobTypeDocuments.get(prospect.jobTitle),
            industry: industryTypeDocuments.get(prospect.industry),
            score: prospectScore,
          };
        } catch (error) {
          console.warn(`Failed to process prospect: ${prospect.name}. Error: ${error.message}`);
          return null;
        }
      }),
    );

    const validRecords = prospectRecords.filter((record) => record !== null);
    await this.prospectsModel.insertMany(validRecords);
  }

  private getRandomScore(): number {
    return Math.floor(Math.random() * 5) + 1; // Aleatorio entre 1 y 5
  }

  private calculateProspectScore(
    yearsOfExperience: number,
    companySize: number,
    jobTypeScore: number,
    industryTypeScore: number,
  ): number {
    const normalizedExperience = Math.min(yearsOfExperience, 20) / 20;
    const normalizedCompanySize = Math.min(1 / Math.max(companySize, 1), 1);
    const jobIndustryAverageScore = (jobTypeScore + industryTypeScore) / 2 / 5;

    const finalScore =
      (3 * normalizedExperience + 2 * normalizedCompanySize + 2 * jobIndustryAverageScore) / 7;

    return Math.min(5, Math.max(1, Math.round(finalScore * 5)));
  }

  async deleteAllRecords() {
    await this.jobTypesModel.deleteMany({});
    await this.industryTypesModel.deleteMany({});
    await this.prospectsModel.deleteMany({});
    return 'All records from all collections have been deleted';
  }
}
