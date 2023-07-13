'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import CharacterCard from './CharacterCard';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import Loading from './loading';

const Profile = () => {
  const ref = useRef(null);

  const saveImage = useCallback(
    (name) => {
      if (ref.current === null) {
        return;
      }

      html2canvas(ref.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 1.5,
      }).then((canvas) => {
        canvas.toBlob(function (blob) {
          saveAs(blob, `${name}_Card_${uid}.png`);
        });
      });
    },
    [ref]
  );

  const router = useRouter();
  const asset_url = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/';
  const [data, setData] = useState(null);
  const [character, setCharacter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showUID, setShowUID] = useState(true);

  const params = useParams();
  const uid = params.uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/u/${uid}`, { next: { revalidate: 180 } });
        if (res.ok) {
          const data = await res.json();
          setData(data);
        } else {
          toast.error('UID not found!', {
            toastId: 'error-uid-not-found',
          });
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen font-sans font-semibold">
      <div className="flex h-auto min-h-screen items-center justify-center">
        <div className="flex overflow-auto">
          <div className="my-5 flex flex-col md:items-center">
            <div className="mx-3 flex h-auto w-[500px] flex-col items-center justify-center gap-4 text-white">
              <Image
                src={asset_url + data?.player.avatar.icon}
                width={120}
                height={120}
                alt="Avatar Icon"
                className="rounded-full border-2 border-stone-300 bg-stone-500"
              />
              <span className="text-3xl">{data?.player.nickname}</span>
              <div className="flex w-full flex-row justify-between text-center">
                <div className="flex flex-col">
                  <span className="text-2xl text-neutral-400">Trailblaze Level</span>
                  <span className="text-xl">{data?.player.level}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl text-neutral-400">Equilibrium Level</span>
                  <span className="text-xl">{data?.player.world_level}</span>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2">
                <span className="text-2xl text-neutral-400">Trailblaze Records</span>
                <div className="flex flex-row justify-between">
                  <span className="text-xl">Characters Owned</span>
                  <span className="text-xl">{data?.player.space_info.avatar_count}</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-xl">Achievements Unlocked: </span>
                  <span className="text-xl">{data?.player.space_info.achievement_count}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-2xl">UID {data?.player.uid}</span>
                <div
                  className="
                  flex
                  cursor-pointer
                  flex-row
                  justify-center 
                  gap-2 
                  rounded-full 
                  bg-stone-800 
                  px-3 
                  py-1 
                  shadow-md 
                  shadow-stone-900 
                  hover:brightness-110
                  active:shadow-none
                "
                  onClick={() => router.push('/')}
                >
                  <Image
                    src={asset_url + 'icon/sign/ReplacementIcon.png'}
                    alt="Change UID Icon"
                    width={24}
                    height={24}
                  />
                  <span> Change UID </span>
                </div>
              </div>
              <div className="flex flex-row gap-6 p-6">
                {data?.characters.map((character, index) => (
                  <Image
                    src={asset_url + character.icon}
                    alt="Character Preview"
                    width={96}
                    height={96}
                    className={`
                    cursor-pointer 
                    rounded-full 
                    hover:brightness-110 
                    ${selected === index ? 'bg-stone-500 ring-2 ring-neutral-300' : ''}
                  `}
                    onClick={() => {
                      setCharacter(data?.characters[index]);
                      setSelected(index);
                    }}
                    key={character.id}
                  />
                ))}
              </div>
            </div>
            {character && (
              <>
                <div className="showcase mx-3" ref={ref}>
                  <CharacterCard character={character} uid={uid} showUID={showUID} />
                </div>
                <div className="mx-3 flex flex-row gap-4">
                  <div
                    className="my-2 flex cursor-pointer flex-row justify-center gap-2 rounded-full bg-stone-800 px-3 py-1 shadow-md shadow-stone-900 hover:brightness-110 active:shadow-none"
                    onClick={() => setShowUID(!showUID)}
                  >
                    <Image src={asset_url + 'icon/sign/Detail.png'} alt="Toggle UID Icon" width={24} height={24} />
                    <span>Toggle UID</span>
                  </div>
                  <div
                    className="my-2 flex cursor-pointer flex-row justify-center gap-2 rounded-full bg-stone-800 px-3 py-1 shadow-md shadow-stone-900 hover:brightness-110 active:shadow-none"
                    onClick={() => saveImage(character.name)}
                  >
                    <Image
                      src={asset_url + 'icon/sign/SettingsImageIcon.png'}
                      alt="Save Image Icon"
                      width={24}
                      height={24}
                    />
                    <span>Save Image</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
