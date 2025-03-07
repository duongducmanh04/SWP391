﻿using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;
 

namespace SkincareBookingService.BLL.Services
{
    public class SkintherapistService : ISkintherapistService
    {
        private readonly IGenericRepository<SkinTherapist> _skintherapistRepository;
        private readonly IGenericRepository<SkinTherapistService> _skintherapistServiceRepository;

        public SkintherapistService(IGenericRepository<SkinTherapist> skintherapistRepository, IGenericRepository<SkinTherapistService> skintherapistServiceRepository)
        {
            _skintherapistRepository = skintherapistRepository;
            _skintherapistServiceRepository = skintherapistServiceRepository;
        }

        public async Task<SkinTherapistDTO> GetSkintherapistByIdAsync(int id)
        {
            var therapist = await _skintherapistRepository.GetByIdAsync(id);
            return new SkinTherapistDTO
            {
                SkintherapistId = therapist.SkintherapistId,
                Name = therapist.Name,
                Speciality = therapist.Speciality,
                Email = therapist.Email,
                Experience = therapist.Experience,
                Image = therapist.Image,
                Degree = therapist.Degree,
                AccountId = therapist.AccountId
            };
        }

        public async Task<List<SkinTherapistDTO>> GetSkintherapistsAsync()
        {
            var therapists = await _skintherapistRepository.GetAllAsync();
            return therapists.Select(t => new SkinTherapistDTO
            {
                SkintherapistId = t.SkintherapistId,
                Name = t.Name,
                Speciality = t.Speciality,
                Email = t.Email,
                Experience = t.Experience,
                Image = t.Image,
                Degree = t.Degree,
                AccountId = t.AccountId
            }).ToList();
        }
        public async Task<List<SkinTherapistDTO>> GetListSkintherapistByServiceId(int serviceId)
        {
            List<int?> skinTherapistIdList = await _skintherapistServiceRepository
                .Query()
                .Where(sts => sts.ServiceId == serviceId)
                .Select(sts => sts.SkintherapistId)
                .ToListAsync();

            List<SkinTherapistDTO> skinTherapistList = new List<SkinTherapistDTO>();

            foreach (int? skinTherapistId in skinTherapistIdList)
            {
                if(skinTherapistId != null) 
                {
                    SkinTherapist? st = await _skintherapistRepository.GetByIdAsync((int)skinTherapistId);
                    skinTherapistList.Add(await MapSkintherapistToSkinTherapistDTO(st));
                }    
            }

            return skinTherapistList;
        }
        //Take skin therapist change it to skin therapist DTO
        private async Task<SkinTherapistDTO> MapSkintherapistToSkinTherapistDTO(SkinTherapist skinTherapist)
        {
            return new SkinTherapistDTO
            {
                SkintherapistId = skinTherapist.SkintherapistId,
                Name = skinTherapist.Name,
                Speciality = skinTherapist.Speciality,
                Email = skinTherapist.Email,
                Experience = skinTherapist.Experience,
                Image = skinTherapist.Image,
                Degree = skinTherapist.Degree,
                AccountId = skinTherapist.AccountId
            };
        }
    }
}
